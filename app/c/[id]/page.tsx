import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { cards, views } from "@/lib/db/schema";

// Don't statically prerender — every visit must hit this server function
export const dynamic = "force-dynamic";

// Cheap, deterministic bot detection. Not a security feature — just keeps
// preview crawlers and obvious bots out of the view count.
const BOT_RE = /bot|crawler|spider|crawling|preview|fetcher|facebookexternalhit|whatsapp|telegrambot|slackbot|discordbot|linkedinbot|twitterbot|googlebot|bingbot|yandex|baiduspider|duckduckbot|applebot/i;

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true; // no UA → almost certainly a bot
  return BOT_RE.test(userAgent);
}

function canonicalUrlFor(
  occasion: string,
  recipientName: string | null,
  senderName: string | null,
): string {
  const params = new URLSearchParams();
  if (recipientName) params.set("name", recipientName);
  if (senderName) params.set("sender", senderName);
  const q = params.toString();
  return `/${occasion}${q ? `?${q}` : ""}`;
}

type Props = { params: Promise<{ id: string }> };

export default async function TrackedCardRedirect({ params }: Props) {
  const { id } = await params;

  // Basic UUID shape check before hitting the DB
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    notFound();
  }

  const [card] = await db.select().from(cards).where(eq(cards.id, id)).limit(1);
  if (!card) notFound();

  const h = await headers();
  const userAgent = h.get("user-agent");
  const referrer = h.get("referer"); // HTTP spelling

  // Log the view (fire-and-forget would lose errors; await is fine — it's one row)
  if (!isBot(userAgent)) {
    try {
      await db.insert(views).values({
        cardId: card.id,
        userAgent: userAgent?.slice(0, 200) ?? null,
        referrer: referrer?.slice(0, 500) ?? null,
      });
    } catch (err) {
      // Don't block the redirect on a logging failure
      console.error("[/c/[id]] failed to record view", err);
    }
  }

  redirect(canonicalUrlFor(card.occasion, card.recipientName, card.senderName));
}
