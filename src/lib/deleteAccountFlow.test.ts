import { describe, expect, it, vi } from "vitest";

import { deleteAccountForUser } from "../../supabase/functions/_shared/deleteAccountFlow";

type QueryResult = { data?: unknown; error?: { message: string } | null };
type StorageObject = {
  name: string;
  id: string | null;
  metadata: Record<string, unknown> | null;
  owner?: string | null;
};

type Mutation = {
  table: string;
  operation: "delete" | "update";
  filter: string;
  values?: Record<string, unknown>;
};

const file = (name: string, owner?: string): StorageObject => ({
  name,
  id: `id:${name}`,
  metadata: {},
  owner,
});
const folder = (name: string): StorageObject => ({ name, id: null, metadata: null });

function createAdminMock(options?: {
  failOn?: string;
  storageEntries?: Record<string, Record<string, StorageObject[]>>;
  storagePageSize?: number;
}) {
  const calls: string[] = [];
  const mutations: Mutation[] = [];
  const failOn = options?.failOn;
  const storageEntries = options?.storageEntries ?? {
    "card-assets": { "user-1": [file("logo.png")] },
    stories: { "user-1": [file("story.png")] },
  };

  const selectedRows: Record<string, unknown[]> = {
    digital_cards: [{ id: "card-1" }],
    card_stories: [{ id: "story-1" }],
    leads: [{ id: "lead-1" }],
    orders: [{ id: "order-1" }],
    website_proposals: [{ id: "proposal-1" }],
    generated_websites: [{ id: "website-1" }],
  };

  const resultFor = (key: string, data: unknown = null): Promise<QueryResult> => Promise.resolve(
    failOn === key
      ? { data: null, error: { message: `boom:${key}` } }
      : { data, error: null },
  );

  const makeQuery = (table: string) => ({
    select: vi.fn(() => ({
      eq: vi.fn((column: string, value: string) => {
        calls.push(`${table}.select.eq:${column}=${value}`);
        return resultFor(`${table}.select`, selectedRows[table] ?? []);
      }),
      in: vi.fn((column: string, values: string[]) => {
        calls.push(`${table}.select.in:${column}=${values.join(",")}`);
        return resultFor(`${table}.select`, selectedRows[table] ?? []);
      }),
    })),
    delete: vi.fn(() => ({
      eq: vi.fn((column: string, value: string) => {
        const filter = `eq:${column}=${value}`;
        calls.push(`${table}.delete.${filter}`);
        mutations.push({ table, operation: "delete", filter });
        return resultFor(`${table}.delete`);
      }),
      in: vi.fn((column: string, values: string[]) => {
        const filter = `in:${column}=${values.join(",")}`;
        calls.push(`${table}.delete.${filter}`);
        mutations.push({ table, operation: "delete", filter });
        return resultFor(`${table}.delete`);
      }),
    })),
    update: vi.fn((values: Record<string, unknown>) => ({
      eq: vi.fn((column: string, value: string) => {
        const filter = `eq:${column}=${value}`;
        calls.push(`${table}.update.${filter}`);
        mutations.push({ table, operation: "update", filter, values });
        return resultFor(`${table}.update`);
      }),
      in: vi.fn((column: string, filterValues: string[]) => {
        const filter = `in:${column}=${filterValues.join(",")}`;
        calls.push(`${table}.update.${filter}`);
        mutations.push({ table, operation: "update", filter, values });
        return resultFor(`${table}.update`);
      }),
    })),
  });

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
      return makeQuery(table);
    }),
    storage: {
      from: vi.fn((bucket: string) => ({
        list: vi.fn(async (prefix: string, listOptions?: { limit?: number; offset?: number }) => {
          const offset = listOptions?.offset ?? 0;
          calls.push(`storage.list:${bucket}/${prefix}:offset=${offset}`);
          if (failOn === `storage.${bucket}.list`) {
            return { data: null, error: { message: `boom:${bucket}.list` } };
          }

          const requestedLimit = listOptions?.limit ?? 100;
          const limit = Math.min(requestedLimit, options?.storagePageSize ?? requestedLimit);
          const entries = storageEntries[bucket]?.[prefix] ?? [];
          return { data: entries.slice(offset, offset + limit), error: null };
        }),
        remove: vi.fn(async (paths: string[]) => {
          calls.push(`storage.remove:${bucket}:${paths.join(",")}`);
          return failOn === `storage.${bucket}.remove`
            ? { error: { message: `boom:${bucket}.remove` } }
            : { error: null };
        }),
      })),
    },
  };

  return { admin, calls, mutations };
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

  it("cleans every audited dependency before deleting auth", async () => {
    const { admin, calls, mutations } = createAdminMock();

    await deleteAccountForUser({
      admin,
      userId: "user-1",
      userEmail: "owner@example.com",
      logger: () => {},
    } as Parameters<typeof deleteAccountForUser>[0] & { userEmail: string });

    expect(calls).toEqual(expect.arrayContaining([
      "alliance_chat.delete.eq:user_id=user-1",
      "legacy_flags.delete.eq:user_id=user-1",
      "webhook_logs.delete.eq:user_id=user-1",
      "push_notification_logs.delete.eq:user_id=user-1",
      "scheduled_push_notifications.delete.eq:user_id=user-1",
      "website_proposals.delete.eq:user_id=user-1",
      "brand_assets.update.eq:uploaded_by=user-1",
      "website_versions.update.eq:created_by=user-1",
      "webstudio_orders.update.eq:user_id=user-1",
      "webstudio_orders.update.eq:customer_email=owner@example.com",
      "webstudio_orders.update.in:proposal_id=proposal-1",
      "client_notes.delete.in:client_id=card-card-1,lead-lead-1,web-proposal-1,order-order-1",
      "client_reminders.delete.in:client_id=card-card-1,lead-lead-1,web-proposal-1,order-order-1",
      "client_tag_assignments.delete.in:client_id=card-card-1,lead-lead-1,web-proposal-1,order-order-1",
    ]));

    expect(mutations).toContainEqual(expect.objectContaining({
      table: "webstudio_orders",
      operation: "update",
      filter: "eq:user_id=user-1",
      values: expect.objectContaining({
        user_id: null,
        proposal_id: null,
        customer_email: "deleted@anonymized.local",
        customer_name: null,
        stripe_customer_id: null,
        items: [],
        options: [],
        admin_notes: null,
      }),
    }));

    const proposalDelete = calls.indexOf("website_proposals.delete.eq:user_id=user-1");
    const linkedOrderAnonymization = calls.indexOf("webstudio_orders.update.in:proposal_id=proposal-1");
    expect(linkedOrderAnonymization).toBeLessThan(proposalDelete);
    expect(calls[calls.length - 1]).toBe("auth.deleteUser:user-1");
  });

  it("recursively removes every paginated storage object before database mutations", async () => {
    const { admin, calls } = createAdminMock({
      storagePageSize: 2,
      storageEntries: {
        "card-assets": {
          "user-1": [folder("photos"), file("root-a.png"), file("root-b.png")],
          "user-1/photos": [file("nested-a.png"), file("nested-b.png"), file("nested-c.png")],
        },
        stories: { "user-1": [] },
      },
    });

    await deleteAccountForUser({ admin, userId: "user-1", logger: () => {} });

    const removedPaths = calls
      .filter((call) => call.startsWith("storage.remove:card-assets:"))
      .flatMap((call) => call.slice("storage.remove:card-assets:".length).split(","));
    expect(removedPaths).toEqual(expect.arrayContaining([
      "user-1/root-a.png",
      "user-1/root-b.png",
      "user-1/photos/nested-a.png",
      "user-1/photos/nested-b.png",
      "user-1/photos/nested-c.png",
    ]));
    expect(calls).toContain("storage.list:card-assets/user-1:offset=2");
    expect(calls).toContain("storage.list:card-assets/user-1/photos:offset=2");

    const firstDatabaseMutation = calls.findIndex((call) => /\.(delete|update)\./.test(call));
    const lastStorageRemoval = calls.reduce(
      (lastIndex, call, index) => call.startsWith("storage.remove:") ? index : lastIndex,
      -1,
    );
    expect(lastStorageRemoval).toBeLessThan(firstDatabaseMutation);
  });

  it("removes shared-path objects owned by the caller without touching another owner", async () => {
    const { admin, calls } = createAdminMock({
      storageEntries: {
        "card-assets": {
          "user-1": [],
          "": [folder("order-photos"), folder("admin-uploads")],
          "order-photos": [
            file("mine.png", "user-1"),
            file("other.png", "user-2"),
            file("anonymous.png"),
          ],
          "admin-uploads": [file("shared.png", "user-1")],
        },
        stories: { "user-1": [] },
        "website-images": {
          "": [folder("products"), folder("other-website")],
          products: [
            file("mine.png", "user-1"),
            file("other.png", "user-2"),
          ],
          "other-website": [file("admin-owned.png", "user-1")],
        },
      },
    });

    await deleteAccountForUser({ admin, userId: "user-1", logger: () => {} });

    const removals = calls.filter((call) => call.startsWith("storage.remove:"));
    expect(removals).toEqual(expect.arrayContaining([
      "storage.remove:card-assets:order-photos/mine.png",
      "storage.remove:website-images:products/mine.png",
    ]));
    expect(removals.join("\n")).not.toContain("other.png");
    expect(removals.join("\n")).not.toContain("anonymous.png");
    expect(removals.join("\n")).not.toContain("shared.png");
    expect(removals.join("\n")).not.toContain("admin-owned.png");
  });

  it("removes the storage tree of a website linked to the caller's proposal", async () => {
    const { admin, calls } = createAdminMock({
      storageEntries: {
        "card-assets": { "user-1": [] },
        stories: { "user-1": [] },
        "website-images": {
          "website-1": [file("admin-upload.png", "admin-user")],
        },
      },
    });

    await deleteAccountForUser({ admin, userId: "user-1", logger: () => {} });

    expect(calls).toContain("generated_websites.select.in:proposal_id=proposal-1");
    expect(calls).toContain(
      "storage.remove:website-images:website-1/admin-upload.png",
    );
  });

  it("does not mutate the database or auth when storage cleanup fails", async () => {
    const { admin, mutations, calls } = createAdminMock({ failOn: "storage.card-assets.remove" });

    await expect(
      deleteAccountForUser({ admin, userId: "user-1", logger: () => {} }),
    ).rejects.toThrow("storage:card-assets");

    expect(mutations).toHaveLength(0);
    expect(calls).not.toContain("auth.deleteUser:user-1");
  });

  it("runs optional identity-provider cleanup immediately before auth deletion", async () => {
    const { admin, calls } = createAdminMock();
    const beforeAuthDelete = vi.fn(async () => {
      calls.push("identity-provider.cleanup");
    });

    await deleteAccountForUser({
      admin,
      userId: "user-1",
      beforeAuthDelete,
      logger: () => {},
    } as Parameters<typeof deleteAccountForUser>[0] & { beforeAuthDelete: () => Promise<void> });

    expect(beforeAuthDelete).toHaveBeenCalledTimes(1);
    expect(calls.slice(-2)).toEqual([
      "identity-provider.cleanup",
      "auth.deleteUser:user-1",
    ]);
  });
});
