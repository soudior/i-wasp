import React from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  // Static wrapper that always renders - prevents layout shifts during route changes
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
