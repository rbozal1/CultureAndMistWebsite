import { AuthForm } from '../../components/auth-form';

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="seller-workspace">
      <div className="workspace-heading">
        <span className="eyebrow">ACCOUNT RECOVERY</span>
        <h1>Reset password.</h1>
      </div>
      <section className="signin-card">
        <AuthForm mode="reset" resetToken={token} />
      </section>
    </main>
  );
}