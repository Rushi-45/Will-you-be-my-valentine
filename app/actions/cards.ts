"use server";

import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { cards, type Card } from "@/lib/db/schema";
import { getOrCreateUser } from "@/lib/db/users";

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
