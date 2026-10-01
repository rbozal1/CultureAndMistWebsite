'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '../lib/auth-client';

type AuthFormMode = 'sign-in' | 'sign-up' | 'reset';

export function AuthForm({ mode, resetToken = null }: { mode: AuthFormMode; resetToken?: string | null }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    setError('');

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '');

    try {
      if (mode === 'sign-in') {
        const result = await authClient.signIn.email({ email, password });
        if (result.error) throw new Error(result.error.message);
        router.replace('/');
        return;
      }

      if (mode === 'sign-up') {
        const name = String(form.get('name') || '').trim();
        const confirmation = String(form.get('confirmation') || '');
        if (password !== confirmation) throw new Error('Passwords do not match.');
        const result = await authClient.signUp.email({
          name,
          email,
          password,
          callbackURL: '/',
        });
        if (result.error) throw new Error(result.error.message);
        setMessage('Check your inbox for a verification link before signing in.');
        return;
      }

      if (!resetToken) {
        const result = await authClient.requestPasswordReset({
          email,
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (result.error) throw new Error(result.error.message);
        setMessage('If an account exists for that address, a reset link is on its way.');
        return;
      }

      const confirmation = String(form.get('confirmation') || '');
      if (password !== confirmation) throw new Error('Passwords do not match.');
      const result = await authClient.resetPassword({ newPassword: password, token: resetToken });
      if (result.error) throw new Error(result.error.message);
      router.replace('/sign-in?reset=complete');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Authentication failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  const isSignIn = mode === 'sign-in';
  const isSignUp = mode === 'sign-up';
  const isResettingPassword = mode === 'reset' && Boolean(resetToken);

  return (
    <form className="form-fields" onSubmit={submit}>
      {isSignUp && <label>Name<input name="name" required maxLength={100} autoComplete="name" /></label>}
      {!isResettingPassword && <label>Email<input name="email" type="email" required autoComplete="email" /></label>}
      {(isSignIn || isSignUp || isResettingPassword) && (
        <label>{isResettingPassword ? 'New password' : 'Password'}<input name="password" type="password" required minLength={8} autoComplete={isSignIn ? 'current-password' : 'new-password'} /></label>
      )}
      {(isSignUp || isResettingPassword) && (
        <label>Confirm password<input name="confirmation" type="password" required minLength={8} autoComplete="new-password" /></label>
      )}
      <button className="primary-btn" disabled={busy}>
        {busy ? 'Please wait...' : isSignIn ? 'Sign in' : isSignUp ? 'Create account' : isResettingPassword ? 'Save new password' : 'Send reset link'}
      </button>
      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}
      {isSignIn && <p><a href="/reset-password">Forgot password?</a></p>}
      {isSignUp && <p>We’ll email you a verification link before your account can be used.</p>}
      {(isSignIn || isSignUp) && (
        <p>{isSignIn ? 'New to Culture & Mist?' : 'Already have an account?'}{' '}
          <a href={isSignIn ? '/sign-up' : '/sign-in'}>{isSignIn ? 'Create an account' : 'Sign in'}</a>
        </p>
      )}
      {mode === 'reset' && <p><a href="/sign-in">Back to sign in</a></p>}
    </form>
  );
}