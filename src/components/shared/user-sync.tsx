"use client";

import { useCurrentUser } from "@/hooks/use-current-user";

/**
 * Invisible component that ensures a user exists in Convex.
 * In demo mode, auto-creates a demo user.
 */
export function UserSync() {
  useCurrentUser();
  return null;
}
