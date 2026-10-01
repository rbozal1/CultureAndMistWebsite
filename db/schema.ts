import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const listings = sqliteTable('listings', {
  id: text('id').primaryKey(),
  sellerId: text('seller_id').notNull(),
  sellerName: text('seller_name').notNull(),
  sellerEmail: text('seller_email').notNull(),
  title: text('title').notNull(),
  brand: text('brand').notNull(),
  category: text('category').notNull(),
  condition: text('condition').notNull(),
  description: text('description').notNull(),
  priceCents: integer('price_cents').notNull(),
  imageKey: text('image_key').notNull(),
  status: text('status').notNull().default('active'),
  createdAt: text('created_at').notNull(),
}, (table) => [index('idx_listings_status_created').on(table.status, table.createdAt), index('idx_listings_seller_created').on(table.sellerId, table.createdAt)]);

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  listingId: text('listing_id').notNull(),
  buyerId: text('buyer_id').notNull(),
  sellerId: text('seller_id').notNull(),
  amountCents: integer('amount_cents').notNull(),
  status: text('status').notNull(),
  paymentReference: text('payment_reference'),
  createdAt: text('created_at').notNull(),
}, (table) => [index('idx_orders_seller_created').on(table.sellerId, table.createdAt)]);

export const stripeAccounts = sqliteTable('stripe_accounts', {
  sellerId: text('seller_id').primaryKey(),
  stripeAccountId: text('stripe_account_id').notNull().unique(),
  createdAt: text('created_at').notNull(),
});

export const authUser = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).notNull(),
});

export const authSession = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expiresAt', { mode: 'timestamp_ms' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull().references(() => authUser.id, { onDelete: 'cascade' }),
}, (table) => [index('idx_auth_session_userId').on(table.userId)]);

export const authAccount = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => authUser.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: integer('accessTokenExpiresAt', { mode: 'timestamp_ms' }),
  refreshTokenExpiresAt: integer('refreshTokenExpiresAt', { mode: 'timestamp_ms' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).notNull(),
}, (table) => [index('idx_auth_account_userId').on(table.userId)]);

export const authVerification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expiresAt', { mode: 'timestamp_ms' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).notNull(),
}, (table) => [index('idx_auth_verification_identifier').on(table.identifier)]);
