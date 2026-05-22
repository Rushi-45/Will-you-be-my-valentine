import { eq } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./index";
import { users, type User } from "./schema";

/**
 * Returns the DB user row for the currently authenticated Clerk user.
 * Lazily creates the row on first call if it doesn't exist (lazy sync).
 *
 * Returns null when no Clerk session is active.
 */
export async function getOrCreateUser(): Promise<User | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const [existing] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (existing) return existing;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const primaryEmail = clerkUser.emailAddresses.find(
    (e) => e.id === clerkUser.primaryEmailAddressId,
  )?.emailAddress;
  if (!primaryEmail) return null;

  const [created] = await db
    .insert(users)
    .values({
      id: userId,
      email: primaryEmail,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    })
    .returning();

  return created;
}
