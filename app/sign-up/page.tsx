import { AuthForm } from '../../components/auth-form';
import { safeAuthReturnTo } from '../../lib/auth-return-to';

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ return_to?: string }>;
}) {
  const { return_to: returnTo } = await searchParams;
  return (
    <main className="seller-workspace">
      <div className="workspace-heading">
        <span className="eyebrow">JOIN CULTURE & MIST</span>
        <h1>Create account.</h1>
      </div>
      <section className="signin-card">
        <AuthForm mode="sign-up" returnTo={safeAuthReturnTo(returnTo)} />
      </section>
    </main>
  );
}