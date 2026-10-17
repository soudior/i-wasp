/** Supabase operations resolve with { error }; they do not necessarily reject. */
export async function checkedDeletionStep<T>(
  label: string,
  operation: () => PromiseLike<T>,
): Promise<T> {
  const result = await operation();
  if (result && typeof result === "object" && "error" in result && result.error) {
    const error = result.error;
    const message = typeof error === "object" && "message" in error
      ? String(error.message) : String(error);
    throw new Error(`${label}: ${message}`);
  }
  return result;
}
