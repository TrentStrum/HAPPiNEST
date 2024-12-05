import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ... rest of the schema remains the same ...

export const payments = sqliteTable('payments', {
  id: text('id').primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  leaseId: text('lease_id').notNull().references(() => leases.id),
  amount: real('amount').notNull(),
  status: text('status', { enum: ['pending', 'completed', 'failed', 'refunded'] }).default('pending'),
  // Remove Stripe-specific field for development
  // stripePaymentId: text('stripe_payment_id'),
  dueDate: text('due_date').notNull(),
  paidDate: text('paid_date'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});