import { database, failure } from '../../../db';
import { getCurrentUser } from '../../current-user';
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Sign in first' }, { status: 401 });
  try {
    const orders = await database().prepare('SELECT o.id,o.listing_id,o.amount_cents,o.status,o.created_at,l.title FROM orders o JOIN listings l ON l.id=o.listing_id WHERE o.seller_id=? ORDER BY o.created_at DESC LIMIT 100').bind(user.userId).all();
    return Response.json({ orders: orders.results });
  } catch (error) { return failure(error); }
}
