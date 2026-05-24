import { eq, desc, sql, count } from "drizzle-orm";
import { db } from "./index";
import { users, cards, views, type Card, type User } from "./schema";

/**
 * Aggregate counts for the admin dashboard.
 */
export async function getAdminStats() {
  const [userCount, cardCount, viewCount] = await Promise.all([
    db.select({ n: count() }).from(users).then((r) => r[0].n),
    db.select({ n: count() }).from(cards).then((r) => r[0].n),
    db.select({ n: count() }).from(views).then((r) => r[0].n),
  ]);
  return {
    users: userCount,
    cards: cardCount,
    views: viewCount,
    avgViewsPerCard: cardCount === 0 ? 0 : Math.round((viewCount / cardCount) * 10) / 10,
  };
}

export type TopCard = Card & {
  viewCount: number;
  ownerEmail: string;
};

/**
 * Top 10 most-viewed cards across all users, with owner email.
 */
export async function getTopViewedCards(limit = 10): Promise<TopCard[]> {
  return db
    .select({
      id: cards.id,
      userId: cards.userId,
      occasion: cards.occasion,
      recipientName: cards.recipientName,
      senderName: cards.senderName,
      createdAt: cards.createdAt,
      viewCount: sql<number>`COUNT(${views.id})::int`,
      ownerEmail: users.email,
    })
    .from(cards)
    .leftJoin(views, eq(views.cardId, cards.id))
    .innerJoin(users, eq(users.id, cards.userId))
    .groupBy(cards.id, users.email)
    .orderBy(desc(sql`COUNT(${views.id})`), desc(cards.createdAt))
    .limit(limit);
}

/**
 * Most recent users to sign up.
 */
export async function getRecentUsers(limit = 10): Promise<User[]> {
  return db.select().from(users).orderBy(desc(users.createdAt)).limit(limit);
}

export type RecentCard = Card & { ownerEmail: string };

/**
 * Most recently saved cards across all users.
 */
export async function getRecentCards(limit = 10): Promise<RecentCard[]> {
  return db
    .select({
      id: cards.id,
      userId: cards.userId,
      occasion: cards.occasion,
      recipientName: cards.recipientName,
      senderName: cards.senderName,
      createdAt: cards.createdAt,
      ownerEmail: users.email,
    })
    .from(cards)
    .innerJoin(users, eq(users.id, cards.userId))
    .orderBy(desc(cards.createdAt))
    .limit(limit);
}

/**
 * Per-occasion breakdown — count of saved cards by occasion slug.
 */
export async function getOccasionBreakdown() {
  return db
    .select({
      occasion: cards.occasion,
      cardCount: sql<number>`COUNT(${cards.id})::int`,
    })
    .from(cards)
    .groupBy(cards.occasion)
    .orderBy(desc(sql`COUNT(${cards.id})`));
}
