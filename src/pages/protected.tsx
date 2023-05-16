//  ** React
import { useState } from 'react';

// ** Next Auth
import { signIn, signOut, useSession } from 'next-auth/react';

// ** Next.js

// ** React Query
import { useMutation } from 'react-query';

// ** API
import { generatePrompt } from '@/generatePrompt';

export default function Protected() {
  const { data: session, status } = useSession();

  const [response, setResponse] = useState(null);

  const { mutate, isLoading } = useMutation(
    async () => {
      if (!session) throw new Error('Not signed in');
      if (!session.accessToken) throw new Error('No access token');

      const prompt = await generatePrompt(session.accessToken);
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
      onSuccess: ({ result }) => {
        setResponse(result);
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

        <button
          className="btn"
          onClick={() =>
            signOut({
              callbackUrl: 'http://localhost:3000/',
            })
          }
        >
          sign out
        </button>

        {response && (
          <div className="bg-gray-400 border-r-2">
            <h2>Response</h2>
            <p>{response}</p>
          </div>
        )}
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
