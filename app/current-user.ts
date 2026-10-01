import { headers } from 'next/headers';
import { database } from '../db';
import { getAuth } from '../lib/auth';

export type CurrentUser = {
  userId: string;
  displayName: string;
  email: string;
  fullName: string | null;
};

async function adoptLegacySellerRecords(user: CurrentUser) {
  const db = database();
  const legacySellers = await db.prepare(
    'SELECT DISTINCT seller_id FROM listings WHERE seller_email = ? COLLATE NOCASE AND seller_id != ? LIMIT 20',
  ).bind(user.email, user.userId).all<{ seller_id: string }>();

  for (const { seller_id: legacyId } of legacySellers.results) {
    const existingStripeAccount = await db.prepare(
      'SELECT stripe_account_id FROM stripe_accounts WHERE seller_id = ?',
    ).bind(user.userId).first();
    const statements = [
      db.prepare('UPDATE listings SET seller_id = ?, seller_name = ?, seller_email = ? WHERE seller_id = ? AND seller_email = ? COLLATE NOCASE')
        .bind(user.userId, user.displayName, user.email, legacyId, user.email),
      db.prepare('UPDATE orders SET seller_id = ? WHERE seller_id = ?').bind(user.userId, legacyId),
      db.prepare('UPDATE orders SET buyer_id = ? WHERE buyer_id = ?').bind(user.userId, legacyId),
    ];

    if (!existingStripeAccount) {
      statements.push(
        db.prepare('UPDATE stripe_accounts SET seller_id = ? WHERE seller_id = ?')
          .bind(user.userId, legacyId),
      );
    }
    await db.batch(statements);
  }
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session || !session.user.emailVerified) return null;

  const user: CurrentUser = {
    userId: session.user.id,
    displayName: session.user.name,
    email: session.user.email,
    fullName: session.user.name,
  };

  try {
    await adoptLegacySellerRecords(user);
  } catch (error) {
    console.error('Could not migrate legacy seller records to the verified account:', error);
  }

  return user;
}