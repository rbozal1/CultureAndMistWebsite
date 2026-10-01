import { getAuth } from '../../../../lib/auth';

async function handleAuth(request: Request) {
  return getAuth().handler(request);
}

export { handleAuth as GET, handleAuth as POST };