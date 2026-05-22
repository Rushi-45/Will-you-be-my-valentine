import type { NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

/**
 * Clerk webhook receiver. Configure in Clerk dashboard →
 * Configure → Webhooks → Add endpoint:
 *   URL: https://<your-domain>/api/webhooks/clerk
 *   Events: user.created, user.updated, user.deleted
 * Then set CLERK_WEBHOOK_SIGNING_SECRET in env vars.
 *
 * Verification is handled by `verifyWebhook` (Svix under the hood).
 * On signature failure → 400. On unknown event → 200 (ack, no-op).
 */
export async function POST(req: NextRequest) {
  let evt;
  try {
    evt = await verifyWebhook(req);
  } catch (err) {
    console.error("[clerk webhook] signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (evt.type) {
      case "user.created":
      case "user.updated": {
        const u = evt.data;
        const primaryEmail = u.email_addresses.find(
          (e) => e.id === u.primary_email_address_id,
        )?.email_address;
        if (!primaryEmail) {
          console.warn("[clerk webhook] no primary email for", u.id);
          return new Response("OK (no primary email)", { status: 200 });
        }

        await db
          .insert(users)
          .values({
            id: u.id,
            email: primaryEmail,
            firstName: u.first_name,
            lastName: u.last_name,
            imageUrl: u.image_url,
          })
          .onConflictDoUpdate({
            target: users.id,
            set: {
              email: primaryEmail,
              firstName: u.first_name,
              lastName: u.last_name,
              imageUrl: u.image_url,
              updatedAt: new Date(),
            },
          });
        break;
      }

      case "user.deleted": {
        if (evt.data.id) {
          // Cards cascade-delete via FK; nothing else to clean up yet.
          await db.delete(users).where(eq(users.id, evt.data.id));
        }
        break;
      }

      // Ignore all other events (session.*, organization.*, etc.)
      default:
        break;
    }
    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("[clerk webhook] handler error", evt.type, err);
    // Return 500 so Clerk retries (default retry policy: ~12 attempts with backoff)
    return new Response("Handler error", { status: 500 });
  }
}
