import { AuthForm } from '../../components/auth-form';

export default function SignInPage() {
  return (
    <main className="seller-workspace">
      <div className="workspace-heading">
        <span className="eyebrow">CULTURE & MIST ACCOUNT</span>
        <h1>Sign in.</h1>
      </div>
      <section className="signin-card">
        <AuthForm mode="sign-in" />
      </section>
    </main>
  );
}