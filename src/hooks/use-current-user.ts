"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useRef } from "react";

const DEMO_CLERK_ID = "demo-user";
const DEMO_EMAIL = "demo@nexus.app";
const DEMO_NAME = "Demo User";

/**
 * Returns the current Convex user.
 * In demo mode (no Clerk), auto-creates a demo user.
 */
export function useCurrentUser() {
  const upsertUser = useMutation(api.functions.users.upsertFromClerk);
  const user = useQuery(api.functions.users.getByClerkId, {
    clerkId: DEMO_CLERK_ID,
  });
  const hasCreated = useRef(false);

  useEffect(() => {
    if (user === null && !hasCreated.current) {
      hasCreated.current = true;
      upsertUser({
        clerkId: DEMO_CLERK_ID,
        email: DEMO_EMAIL,
        name: DEMO_NAME,
      });
    }
  }, [user, upsertUser]);

  return user;
}
