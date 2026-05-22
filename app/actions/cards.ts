"use server";

import { eq, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { cards, views, type Card } from "@/lib/db/schema";
import { getOrCreateUser } from "@/lib/db/users";

export type CardWithStats = Card & {
  viewCount: number;
  lastViewedAt: Date | null;
};

type SaveCardInput = {
  occasion: string;
  recipientName?: string | null;
  senderName?: string | null;
};

/**
 * Save a personalized card to the signed-in user's dashboard.
 * Returns the saved row. Throws if no Clerk session is active.
 */
export async function saveCard(input: SaveCardInput): Promise<Card> {
  const user = await getOrCreateUser();
  if (!user) throw new Error("You must be signed in to save a card.");

  const [card] = await db
    .insert(cards)
    .values({
      userId: user.id,
      occasion: input.occasion,
      recipientName: input.recipientName ?? null,
      senderName: input.senderName ?? null,
    })
    .returning();

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/cards");
  return card;
}

/**
 * Delete a card the user owns. Throws if the card doesn't belong to them.
 */
export async function deleteCard(cardId: string): Promise<void> {
  const user = await getOrCreateUser();
  if (!user) throw new Error("You must be signed in.");

  const [existing] = await db.select().from(cards).where(eq(cards.id, cardId)).limit(1);
  if (!existing) throw new Error("Card not found.");
  if (existing.userId !== user.id) throw new Error("Not allowed.");

  await db.delete(cards).where(eq(cards.id, cardId));
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/cards");
}

/**
 * List all cards owned by the signed-in user, newest first.
 */
export async function listUserCards(): Promise<Card[]> {
  const user = await getOrCreateUser();
  if (!user) return [];

  return db
    .select()
    .from(cards)
    .where(eq(cards.userId, user.id))
    .orderBy(desc(cards.createdAt));
}

/**
 * Same as listUserCards but with per-card view stats joined in one query.
 */
export async function listUserCardsWithStats(): Promise<CardWithStats[]> {
  const user = await getOrCreateUser();
  if (!user) return [];

  const rows = await db
    .select({
      id: cards.id,
      userId: cards.userId,
      occasion: cards.occasion,
      recipientName: cards.recipientName,
      senderName: cards.senderName,
      createdAt: cards.createdAt,
      viewCount: sql<number>`COUNT(${views.id})::int`,
      lastViewedAt: sql<Date | null>`MAX(${views.viewedAt})`,
    })
    .from(cards)
    .leftJoin(views, eq(views.cardId, cards.id))
    .where(eq(cards.userId, user.id))
    .groupBy(cards.id)
    .orderBy(desc(cards.createdAt));

  return rows;
}
