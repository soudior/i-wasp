import { describe, expect, it, vi } from "vitest";

import { deleteAccountForUser } from "./deleteAccountFlow";

type QueryResult = { data?: unknown; error?: { message: string } | null };

function createAdminMock(options?: {
  failOn?: string;
}) {
  const calls: string[] = [];
  const failOn = options?.failOn;

  const makeQuery = (table: string) => {
    const selectedRows = table === "digital_cards"
      ? [{ id: "card-1" }]
      : table === "card_stories"
        ? [{ id: "story-1", card_id: "card-1" }]
        : [];

    return {
      select: vi.fn(() => ({
        eq: vi.fn((column: string, value: string) => {
          calls.push(`${table}.select.eq:${column}=${value}`);
          if (failOn === `${table}.select`) {
            return Promise.resolve({ data: null, error: { message: `boom:${table}` } } satisfies QueryResult);
          }
          return Promise.resolve({ data: selectedRows, error: null } satisfies QueryResult);
        }),
        in: vi.fn((column: string, values: string[]) => {
          calls.push(`${table}.select.in:${column}=${values.join(",")}`);
          if (failOn === `${table}.select`) {
            return Promise.resolve({ data: null, error: { message: `boom:${table}` } } satisfies QueryResult);
          }
          return Promise.resolve({ data: selectedRows, error: null } satisfies QueryResult);
        }),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn((column: string, value: string) => {
          calls.push(`${table}.delete.eq:${column}=${value}`);
          if (failOn === `${table}.delete`) {
            return Promise.resolve({ error: { message: `boom:${table}` } } satisfies QueryResult);
          }
          return Promise.resolve({ error: null } satisfies QueryResult);
        }),
        in: vi.fn((column: string, values: string[]) => {
          calls.push(`${table}.delete.in:${column}=${values.join(",")}`);
          if (failOn === `${table}.delete`) {
            return Promise.resolve({ error: { message: `boom:${table}` } } satisfies QueryResult);
          }
          return Promise.resolve({ error: null } satisfies QueryResult);
        }),
      })),
      update: vi.fn(() => ({
        eq: vi.fn((column: string, value: string) => {
          calls.push(`${table}.update.eq:${column}=${value}`);
          if (failOn === `${table}.update`) {
            return Promise.resolve({ error: { message: `boom:${table}` } } satisfies QueryResult);
          }
          return Promise.resolve({ error: null } satisfies QueryResult);
        }),
      })),
    };
  };

  const admin = {
    auth: {
      admin: {
        deleteUser: vi.fn(async (userId: string) => {
          calls.push(`auth.deleteUser:${userId}`);
          return failOn === "auth.deleteUser"
            ? { error: { message: "boom:auth" } }
            : { error: null };
        }),
      },
    },
    from: vi.fn((table: string) => {
      calls.push(`from:${table}`);
      if (table === "orders") {
        return {
          update: vi.fn((patch: Record<string, unknown>) => ({
            eq: vi.fn((column: string, value: string) => {
              calls.push(`orders.update.eq:${column}=${value}`);
              if (failOn === "orders.update") {
                return Promise.resolve({ error: { message: "boom:orders" } } satisfies QueryResult);
              }
              return Promise.resolve({ error: null } satisfies QueryResult);
            }),
          })),
        };
      }
      return makeQuery(table);
    }),
    storage: {
      from: vi.fn((bucket: string) => ({
        list: vi.fn(async (prefix: string) => {
          calls.push(`storage.list:${bucket}/${prefix}`);
          return { data: [{ name: "logo.png" }], error: null };
        }),
        remove: vi.fn(async (paths: string[]) => {
          calls.push(`storage.remove:${bucket}/${paths.join(",")}`);
          return failOn === `storage.${bucket}.remove`
            ? { error: { message: `boom:${bucket}` } }
            : { error: null };
        }),
      })),
    },
  };

  return { admin, calls };
}

describe("deleteAccountForUser", () => {
  it("stops immediately when a critical deletion step fails", async () => {
    const { admin, calls } = createAdminMock({ failOn: "leads.delete" });

    await expect(
      deleteAccountForUser({
        admin,
        userId: "user-1",
        logger: () => {},
      }),
    ).rejects.toThrow("leads");

    expect(calls).not.toContain("auth.deleteUser:user-1");
  });

  it("deletes dependencies before deleting auth", async () => {
    const { admin, calls } = createAdminMock();

    await deleteAccountForUser({
      admin,
      userId: "user-1",
      logger: () => {},
    });

    expect(calls[calls.length - 1]).toBe("auth.deleteUser:user-1");
    expect(calls).toContain("orders.update.eq:user_id=user-1");
  });
});
