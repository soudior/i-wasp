#!/usr/bin/env bash
# Apply the launch-grid migration on a real Postgres and call prepare_nfc_order.
# The server clock is 2026-10-23 for the launch grid, then 2026-12-02 for the
# official grid. Stripe stays mocked: the edge handlers read the stored rows.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PG_BIN="${PG_BIN:-/usr/lib/postgresql/16/bin}"
DATA="${TMPDIR:-/tmp}/iwasp-prepare-nfc-order-pg"
PORT="${PGPORT:-55432}"
SOCKET="${PGSOCKET:-/tmp}"
LIBFAKETIME="${LIBFAKETIME:-/usr/lib/x86_64-linux-gnu/faketime/libfaketime.so.1}"
MIGRATION="$ROOT/supabase/migrations/20261022180000_prepare_nfc_order_launch_grid.sql"
SCHEMA="$ROOT/scripts/sql/prepare_nfc_order_schema.sql"
TEST_SQL="$ROOT/supabase/tests/prepare_nfc_order.sql"
export TZ=UTC

if [[ ! -x "$PG_BIN/initdb" || ! -x "$PG_BIN/pg_ctl" ]]; then
  echo "PostgreSQL 16 binaries not found at $PG_BIN" >&2
  exit 1
fi
if [[ ! -f "$LIBFAKETIME" ]]; then
  echo "libfaketime not found at $LIBFAKETIME" >&2
  exit 1
fi

if grep -E 'pg_catalog\.(coalesce|nullif|greatest|least)[[:space:]]*\(' "$MIGRATION"; then
  echo "migration still schema-qualifies a SQL parser form" >&2
  exit 1
fi

psql_as() {
  psql -h "$SOCKET" -p "$PORT" -U postgres -v ON_ERROR_STOP=1 "$@"
}

stop_server() {
  if [[ -d "$DATA" ]]; then
    "$PG_BIN/pg_ctl" -D "$DATA" -m fast stop >/dev/null 2>&1 || true
  fi
}

cleanup() {
  stop_server
}
trap cleanup EXIT

rm -rf "$DATA"
"$PG_BIN/initdb" -D "$DATA" --username=postgres --auth=trust --locale=C --encoding=UTF8 >/dev/null

start_at() {
  local stamp="$1"
  stop_server
  LD_PRELOAD="$LIBFAKETIME" \
  FAKETIME="$stamp" \
  FAKETIME_DONT_FAKE_MONOTONIC=1 \
  TZ=UTC \
    "$PG_BIN/pg_ctl" -D "$DATA" -l "$DATA/server.log" -w -t 30 start \
      -o "-p $PORT -k $SOCKET -c listen_addresses=''"
}

run_phase() {
  local stamp="$1"
  local now_iso="$2"
  local dump="$3"
  echo "== Postgres clock $stamp =="
  start_at "$stamp"
  psql_as -d postgres -c "SELECT now();"
  psql_as -d postgres -c "DROP DATABASE IF EXISTS nfc_order_test;"
  psql_as -d postgres -c "CREATE DATABASE nfc_order_test;"
  psql_as -d nfc_order_test -f "$SCHEMA"
  psql_as -d nfc_order_test -f "$MIGRATION"
  psql_as -d nfc_order_test -f "$MIGRATION"
  psql_as -d nfc_order_test -f "$TEST_SQL"
  psql_as -d nfc_order_test -At -c "
    SELECT COALESCE(json_agg(json_build_object(
      'id', id,
      'user_id', user_id,
      'status', status,
      'paid_at', paid_at,
      'payment_method', payment_method,
      'quantity', quantity,
      'unit_price_cents', unit_price_cents,
      'total_price_cents', total_price_cents,
      'currency', currency,
      'checkout_key', checkout_key,
      'checkout_revision', checkout_revision,
      'digital_card_id', digital_card_id,
      'subscription_id', subscription_id,
      'order_items', order_items
    )), '[]'::json)
    FROM public.orders;
  " > "$dump"
  echo "stored rows: $(python3 -c 'import json,sys; print(len(json.load(open(sys.argv[1]))))' "$dump")"
  (
    cd "$ROOT"
    PREPARE_NFC_ORDERS_JSON="$dump" PREPARE_NFC_NOW="$now_iso" \
      npx vitest run src/lib/prepareNfcOrder.db.test.ts
  )
}

run_phase "2026-10-23 12:00:00" "2026-10-23T12:00:00Z" "$DATA/orders-launch.json"
run_phase "2026-12-02 12:00:00" "2026-12-02T12:00:00Z" "$DATA/orders-standard.json"

echo "PREPARE_NFC_ORDER_DB_OK"
