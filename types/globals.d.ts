// Module augmentation for Clerk's UserPublicMetadata.
// Set per-user in Clerk dashboard → user → Metadata → Public metadata:
//   { "role": "admin" }
// Read on the server via `currentUser()` or `auth()` session claims.
export {};

declare global {
  interface UserPublicMetadata {
    role?: "admin";
  }
}
