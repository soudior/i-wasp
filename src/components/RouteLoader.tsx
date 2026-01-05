import React from "react";

export function RouteLoader() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-background text-foreground">
      <div
        className="h-6 w-6 rounded-full border-2 border-muted border-t-primary animate-spin"
        aria-label="Chargement"
      />
    </div>
  );
}
