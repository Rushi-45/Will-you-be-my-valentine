import { pgTable, text, timestamp, uuid, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Users table — mirrors the relevant Clerk user fields.
 * The primary key is Clerk's user ID (e.g. "user_2abc...") so we can
 * join app data to Clerk identities without a separate mapping.
 */
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Cards — saved personalizations created by signed-in users.
 * Stores the input data needed to re-render a card; the actual rendering
 * uses the URL-param pattern (e.g. /valentines?name=...&sender=...).
 */
export const cards = pgTable(
  "cards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    occasion: text("occasion").notNull(), // "valentines", "birthday", etc.
    recipientName: text("recipient_name"),
    senderName: text("sender_name"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("cards_user_idx").on(t.userId, t.createdAt)],
);

export const usersRelations = relations(users, ({ many }) => ({
  cards: many(cards),
}));

export const cardsRelations = relations(cards, ({ one }) => ({
  user: one(users, { fields: [cards.userId], references: [users.id] }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Card = typeof cards.$inferSelect;
export type NewCard = typeof cards.$inferInsert;
