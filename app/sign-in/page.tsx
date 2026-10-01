import { AuthForm } from '../../components/auth-form';
import { safeAuthReturnTo } from '../../lib/auth-return-to';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ return_to?: string }>;
}) {
  const { return_to: returnTo } = await searchParams;
  return (
    <main className="seller-workspace">
      <div className="workspace-heading">
        <span className="eyebrow">CULTURE & MIST ACCOUNT</span>
        <h1>Sign in.</h1>
      </div>
      <section className="signin-card">
        <AuthForm mode="sign-in" returnTo={safeAuthReturnTo(returnTo)} />
      </section>
    </main>
  );
}