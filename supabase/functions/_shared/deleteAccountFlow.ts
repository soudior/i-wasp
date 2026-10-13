import {
  anonymizedOrderPatch,
  anonymizedWebstudioOrderPatch,
} from "./accountDeletion.ts";

export type DeleteAccountLogger = (step: string, details?: unknown) => void;

type QueryResult<T = unknown> = Promise<{ data: T | null; error: { message: string } | null }>;

type QueryBuilder = {
  select(columns: string): {
    eq(column: string, value: string): QueryResult<unknown[]>;
    in(column: string, values: string[]): QueryResult<unknown[]>;
  };
  delete(): {
    eq(column: string, value: string): QueryResult;
    in(column: string, values: string[]): QueryResult;
  };
  update(values: Record<string, unknown>): {
    eq(column: string, value: string): QueryResult;
    in(column: string, values: string[]): QueryResult;
  };
};

type StorageObject = {
  name: string;
  id?: string | null;
  metadata?: Record<string, unknown> | null;
  owner?: string | null;
};

type StorageBucketClient = {
  list(
    path: string,
    options?: { limit?: number; offset?: number },
  ): Promise<{ data: StorageObject[] | null; error: { message: string } | null }>;
  remove(paths: string[]): Promise<{ error: { message: string } | null }>;
};

export type DeleteAccountAdminClient = {
  from(table: string): QueryBuilder;
  storage: {
    from(bucket: string): StorageBucketClient;
  };
  auth: {
    admin: {
      deleteUser(userId: string): Promise<{ error: { message: string } | null }>;
    };
  };
};

async function mustSucceed<T>(
  promise: Promise<{ data: T | null; error: { message: string } | null }>,
  label: string,
): Promise<T | null> {
  const { data, error } = await promise;
  if (error) {
    throw new Error(`${label}: ${error.message}`);
  }
  return data;
}

async function mustMutate(
  promise: Promise<{ error: { message: string } | null }>,
  label: string,
): Promise<void> {
  const { error } = await promise;
  if (error) {
    throw new Error(`${label}: ${error.message}`);
  }
}

const STORAGE_PAGE_SIZE = 1000;
const STORAGE_REMOVE_BATCH_SIZE = 100;

async function removeStorageTree(
  storage: StorageBucketClient,
  bucket: string,
  root: string,
  log: DeleteAccountLogger,
  shouldRemove: (object: StorageObject, path: string) => boolean = () => true,
): Promise<void> {
  const prefixes = [root];
  const visited = new Set<string>();
  const filePaths: string[] = [];

  while (prefixes.length > 0) {
    const prefix = prefixes.shift();
    if (prefix === undefined || visited.has(prefix)) continue;
    visited.add(prefix);

    let offset = 0;
    while (true) {
      const objects = await mustSucceed(
        storage.list(prefix, { limit: STORAGE_PAGE_SIZE, offset }),
        `storage:${bucket} (listing ${prefix})`,
      );
      if (!objects || objects.length === 0) break;

      for (const object of objects) {
        const path = prefix ? `${prefix}/${object.name}` : object.name;
        const isFolder = object.id == null && object.metadata == null;
        if (isFolder) {
          prefixes.push(path);
        } else if (shouldRemove(object, path)) {
          filePaths.push(path);
        }
      }
      offset += objects.length;
    }
  }

  for (let index = 0; index < filePaths.length; index += STORAGE_REMOVE_BATCH_SIZE) {
    await mustMutate(
      storage.remove(filePaths.slice(index, index + STORAGE_REMOVE_BATCH_SIZE)),
      `storage:${bucket}`,
    );
  }

  log(filePaths.length > 0 ? `OK: storage:${bucket}` : `SKIP: storage:${bucket}`);
}

export async function deleteAccountForUser(opts: {
  admin: DeleteAccountAdminClient;
  userId: string;
  userEmail?: string;
  beforeAuthDelete?: () => Promise<void>;
  logger?: DeleteAccountLogger;
}): Promise<{ success: true }> {
  const { admin, userId } = opts;
  const log = opts.logger ?? (() => {});

  log("Suppression demandée", { userId });

  const cards = await mustSucceed(
    admin.from("digital_cards").select("id").eq("user_id", userId),
    "digital_cards (lecture)",
  );
  const cardIds = (cards ?? []).map((card: { id: string }) => card.id).filter(Boolean);

  let storyIds: string[] = [];
  let leadIds: string[] = [];
  if (cardIds.length > 0) {
    const stories = await mustSucceed(
      admin.from("card_stories").select("id").in("card_id", cardIds),
      "card_stories (lecture)",
    );
    storyIds = (stories ?? []).map((story: { id: string }) => story.id).filter(Boolean);

    const leads = await mustSucceed(
      admin.from("leads").select("id").in("card_id", cardIds),
      "leads (lecture)",
    );
    leadIds = (leads ?? []).map((lead: { id: string }) => lead.id).filter(Boolean);
  }

  const proposals = await mustSucceed(
    admin.from("website_proposals").select("id").eq("user_id", userId),
    "website_proposals (lecture)",
  );
  const proposalIds = (proposals ?? []).map((proposal: { id: string }) => proposal.id).filter(Boolean);
  let websiteIds: string[] = [];
  if (proposalIds.length > 0) {
    const websites = await mustSucceed(
      admin.from("generated_websites").select("id").in("proposal_id", proposalIds),
      "generated_websites (lecture)",
    );
    websiteIds = (websites ?? []).map((website: { id: string }) => website.id).filter(Boolean);
  }

  const orders = await mustSucceed(
    admin.from("orders").select("id").eq("user_id", userId),
    "orders (lecture)",
  );
  const orderIds = (orders ?? []).map((order: { id: string }) => order.id).filter(Boolean);

  // Storage is handled first so a retry can still discover every database-owned file.
  for (const bucket of ["card-assets", "stories"]) {
    await removeStorageTree(admin.storage.from(bucket), bucket, userId, log);
  }
  const legacyOwnedRoots: Array<[bucket: string, root: string]> = [
    ["card-assets", "order-photos"],
    ["card-assets", "logos"],
    ["website-images", "logos"],
    ["website-images", "products"],
  ];
  for (const [bucket, root] of legacyOwnedRoots) {
    await removeStorageTree(
      admin.storage.from(bucket),
      bucket,
      root,
      log,
      (object) => object.owner === userId,
    );
  }
  for (const websiteId of websiteIds) {
    await removeStorageTree(
      admin.storage.from("website-images"),
      "website-images",
      websiteId,
      log,
    );
  }

  const crmClientIds = [
    ...cardIds.map((id) => `card-${id}`),
    ...leadIds.map((id) => `lead-${id}`),
    ...proposalIds.map((id) => `web-${id}`),
    ...orderIds.map((id) => `order-${id}`),
  ];
  if (crmClientIds.length > 0) {
    for (const table of ["client_notes", "client_reminders", "client_tag_assignments"]) {
      await mustMutate(
        admin.from(table).delete().in("client_id", crmClientIds),
        `${table} (clients du compte)`,
      );
    }
  }

  if (storyIds.length > 0) {
    await mustMutate(
      admin.from("story_analytics").delete().in("story_id", storyIds),
      "story_analytics (par story)",
    );
  }

  await mustMutate(
    admin.from("push_notification_logs").delete().eq("user_id", userId),
    "push_notification_logs",
  );
  await mustMutate(
    admin.from("scheduled_push_notifications").delete().eq("user_id", userId),
    "scheduled_push_notifications",
  );

  if (cardIds.length > 0) {
    await mustMutate(admin.from("leads").delete().in("card_id", cardIds), "leads (par carte)");
    await mustMutate(admin.from("card_scans").delete().in("card_id", cardIds), "card_scans (par carte)");
    await mustMutate(
      admin.from("push_subscriptions").delete().in("card_id", cardIds),
      "push_subscriptions (par carte)",
    );
    await mustMutate(admin.from("card_stories").delete().in("card_id", cardIds), "card_stories (par carte)");
  }

  await mustMutate(admin.from("alliance_chat").delete().eq("user_id", userId), "alliance_chat");
  await mustMutate(admin.from("legacy_flags").delete().eq("user_id", userId), "legacy_flags");
  await mustMutate(admin.from("webhook_logs").delete().eq("user_id", userId), "webhook_logs");
  await mustMutate(
    admin.from("template_assignments").delete().eq("user_id", userId),
    "template_assignments",
  );

  await mustMutate(
    admin.from("orders").update(anonymizedOrderPatch()).eq("user_id", userId),
    "orders (anonymisation)",
  );

  const webstudioPatch = anonymizedWebstudioOrderPatch();
  await mustMutate(
    admin.from("webstudio_orders").update(webstudioPatch).eq("user_id", userId),
    "webstudio_orders (anonymisation utilisateur)",
  );
  if (opts.userEmail) {
    await mustMutate(
      admin.from("webstudio_orders").update(webstudioPatch).eq("customer_email", opts.userEmail),
      "webstudio_orders (anonymisation e-mail)",
    );
  }
  if (proposalIds.length > 0) {
    await mustMutate(
      admin.from("webstudio_orders").update(webstudioPatch).in("proposal_id", proposalIds),
      "webstudio_orders (anonymisation propositions)",
    );
  }

  await mustMutate(
    admin.from("brand_assets").update({ uploaded_by: null }).eq("uploaded_by", userId),
    "brand_assets (désolidarisation)",
  );
  await mustMutate(
    admin.from("website_versions").update({ created_by: null }).eq("created_by", userId),
    "website_versions (désolidarisation)",
  );
  await mustMutate(
    admin.from("website_proposals").delete().eq("user_id", userId),
    "website_proposals",
  );

  await mustMutate(admin.from("digital_cards").delete().eq("user_id", userId), "digital_cards");
  await mustMutate(admin.from("profiles").delete().eq("user_id", userId), "profiles");
  await mustMutate(admin.from("subscriptions").delete().eq("user_id", userId), "subscriptions");
  await mustMutate(admin.from("webhook_configs").delete().eq("user_id", userId), "webhook_configs");
  await mustMutate(admin.from("rental_properties").delete().eq("user_id", userId), "rental_properties");

  await opts.beforeAuthDelete?.();

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    throw new Error(`auth.admin.deleteUser: ${error.message}`);
  }

  log("Compte supprimé avec succès", { userId });
  return { success: true };
}
