import { getCurrentUser } from '../../current-user';
export async function GET() {
  const user = await getCurrentUser();
  return Response.json({ user: user ? { id: user.userId, name: user.displayName, email: user.email } : null });
}
