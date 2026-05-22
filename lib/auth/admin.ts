import { currentUser } from "@clerk/nextjs/server";

/**
 * Returns true if the signed-in user has `publicMetadata.role === "admin"`.
 * Set this in Clerk dashboard → user → Metadata → Public metadata.
 */
export async function isAdmin(): Promise<boolean> {
  const user = await currentUser();
  if (!user) return false;
  return user.publicMetadata?.role === "admin";
}
