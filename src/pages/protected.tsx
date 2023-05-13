//  ** React

// ** Next Auth
import { signIn, signOut, useSession } from 'next-auth/react';

// ** Next.js

// ** React Query
import { generatePrompt } from '@/generatePrompt';
import { useMutation } from 'react-query';

export default function Protected() {
  const { data: session, status } = useSession();

  const { mutate, isLoading } = useMutation(
    async () => {
      if (!session) throw new Error('Not signed in');
      if (!session.accessToken) throw new Error('No access token');

      const prompt = await generatePrompt(session.accessToken, 'artists');
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      return data;
    },
    {
      onSuccess: (data) => {
        console.log(data);
      },
    }
  );

  if (session) {
    return (
      <div>
        <div>signed in</div>
        <p>email: {session.user?.email}</p>
        <p>name: {session.user?.name}</p>

        <button onClick={() => mutate()} className="btn btn-primary">
          {isLoading ? 'Generating ...' : 'Generate'}
        </button>

        <button className="btn" onClick={() => signOut()}>
          sign out
        </button>
      </div>
    );
  }

  return (
    <div>
      <div>not signed in</div>
      <button className="btn" onClick={() => signIn()}>
        sign in
      </button>
    </div>
  );
}
