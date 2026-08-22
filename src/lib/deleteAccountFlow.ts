import { anonymizedOrderPatch } from "@/lib/accountDeletion";

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
  };
};

export type DeleteAccountAdminClient = {
  from(table: string): QueryBuilder;
  storage: {
    from(bucket: string): {
      list(path: string, options?: { limit?: number }): Promise<{ data: { name: string }[] | null; error: { message: string } | null }>;
      remove(paths: string[]): Promise<{ error: { message: string } | null }>;
    };
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

export async function deleteAccountForUser(opts: {
  admin: DeleteAccountAdminClient;
  userId: string;
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
  if (cardIds.length > 0) {
    const stories = await mustSucceed(
      admin.from("card_stories").select("id").in("card_id", cardIds),
      "card_stories (lecture)",
    );
    storyIds = (stories ?? []).map((story: { id: string }) => story.id).filter(Boolean);
  }

  if (storyIds.length > 0) {
    await mustMutate(
      admin.from("story_analytics").delete().in("story_id", storyIds),
      "story_analytics (par story)",
    );
    log("OK: story_analytics (par story)");
  }

  if (cardIds.length > 0) {
    await mustMutate(admin.from("leads").delete().in("card_id", cardIds), "leads (par carte)");
    await mustMutate(admin.from("card_scans").delete().in("card_id", cardIds), "card_scans (par carte)");
    await mustMutate(admin.from("push_subscriptions").delete().in("card_id", cardIds), "push_subscriptions (par carte)");
    await mustMutate(admin.from("card_stories").delete().in("card_id", cardIds), "card_stories (par carte)");
  }

  await mustMutate(admin.from("template_assignments").delete().eq("user_id", userId), "template_assignments");
  await mustMutate(admin.from("digital_cards").delete().eq("user_id", userId), "digital_cards");
  await mustMutate(admin.from("profiles").delete().eq("user_id", userId), "profiles");
  await mustMutate(admin.from("subscriptions").delete().eq("user_id", userId), "subscriptions");
  await mustMutate(admin.from("webhook_configs").delete().eq("user_id", userId), "webhook_configs");
  await mustMutate(admin.from("rental_properties").delete().eq("user_id", userId), "rental_properties");

  await mustMutate(
    admin.from("orders").update(anonymizedOrderPatch()).eq("user_id", userId),
    "orders (anonymisation)",
  );

  for (const bucket of ["card-assets", "stories"]) {
    const files = await mustSucceed(
      admin.storage.from(bucket).list(userId, { limit: 1000 }),
      `storage:${bucket} (listing)`,
    );
    if (files && files.length > 0) {
      await mustMutate(
        admin.storage.from(bucket).remove(files.map((file) => `${userId}/${file.name}`)),
        `storage:${bucket}`,
      );
      log(`OK: storage:${bucket}`);
    } else {
      log(`SKIP: storage:${bucket}`);
    }
  }

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    throw new Error(`auth.admin.deleteUser: ${error.message}`);
  }

  log("Compte supprimé avec succès", { userId });
  return { success: true };
}
