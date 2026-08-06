-- SÉCURITÉ (P1-ACT) — Générer un code de série ALÉATOIRE, indépendant de l'UUID.
--
-- Problème : la fonction generate_serial_code() dérivait le code des 12 premiers
-- caractères hex de l'UUID de la carte, et get_public_card expose cet UUID aux
-- visiteurs anonymes → n'importe qui pouvait recalculer le code d'activation.
--
-- Correctif : produire un code aléatoire (6 octets = 12 hex) au MÊME format
-- « XXXX-XXXX-XXXX », compatible avec verify_activation_code (qui compare sur
-- REPLACE(serial_code,'-','')).
--
-- ⚠️ IMPORTANT : on ne régénère PAS les codes existants (pas de backfill).
-- Les cartes déjà imprimées/livrées conservent leur code gravé. Seules les
-- NOUVELLES cartes reçoivent un code aléatoire.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION generate_serial_code()
RETURNS TRIGGER AS $$
DECLARE
  hex text;
BEGIN
  IF NEW.serial_code IS NULL THEN
    -- 6 octets aléatoires -> 12 caractères hexadécimaux
    hex := UPPER(encode(gen_random_bytes(6), 'hex'));
    NEW.serial_code :=
      SUBSTRING(hex FROM 1 FOR 4) || '-' ||
      SUBSTRING(hex FROM 5 FOR 4) || '-' ||
      SUBSTRING(hex FROM 9 FOR 4);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Le trigger existant (trigger_generate_serial_code) continue d'utiliser cette fonction.
