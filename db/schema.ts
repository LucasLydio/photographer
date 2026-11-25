import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const portfolioItems = pgTable('portfolio_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 90 }).notNull(),
  category: varchar('category', { length: 32 }).notNull(),
  imageUrl: text('image_url').notNull(),
  alt: varchar('alt', { length: 180 }).notNull(),
  published: boolean('published').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type NewPortfolioItem = typeof portfolioItems.$inferInsert;
export type PortfolioRecord = typeof portfolioItems.$inferSelect;
