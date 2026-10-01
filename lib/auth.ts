import { betterAuth } from 'better-auth';
import { env } from 'cloudflare:workers';

type AuthEmailOptions = {
  to: string;
  subject: string;
  url: string;
};

async function sendAuthEmail({ to, subject, url }: AuthEmailOptions) {
  const apiKey = env.RESEND_API_KEY;
  const from = env.AUTH_EMAIL_FROM;
  if (!apiKey || !from) {
    throw new Error('Configure RESEND_API_KEY and AUTH_EMAIL_FROM to send account email.');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, text: `Continue securely: ${url}` }),
  });
  if (!response.ok) {
    throw new Error(`Account email could not be sent (${response.status}).`);
  }
}

function createAuth() {
  const database = env.DB;
  const secret = env.BETTER_AUTH_SECRET;
  const baseURL = env.BETTER_AUTH_URL;
  if (!database) throw new Error('The D1 DB binding is required for authentication.');
  if (!secret) throw new Error('Configure BETTER_AUTH_SECRET for authentication.');
  if (!baseURL) throw new Error('Configure BETTER_AUTH_URL for authentication.');

  return betterAuth({
    database,
    secret,
    baseURL,
    trustedOrigins: [baseURL],
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }) => {
        await sendAuthEmail({
          to: user.email,
          subject: 'Reset your Culture & Mist password',
          url,
        });
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        await sendAuthEmail({
          to: user.email,
          subject: 'Verify your Culture & Mist email',
          url,
        });
      },
    },
  });
}

type AuthInstance = ReturnType<typeof createAuth>;
let authInstance: AuthInstance | undefined;

export function getAuth(): AuthInstance {
  if (!authInstance) authInstance = createAuth();
  return authInstance;
}