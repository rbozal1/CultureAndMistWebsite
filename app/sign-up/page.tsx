import { AuthForm } from '../../components/auth-form';

export default function SignUpPage() {
  return (
    <main className="seller-workspace">
      <div className="workspace-heading">
        <span className="eyebrow">JOIN CULTURE & MIST</span>
        <h1>Create account.</h1>
      </div>
      <section className="signin-card">
        <AuthForm mode="sign-up" />
      </section>
    </main>
  );
}