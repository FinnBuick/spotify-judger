import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

export async function fetchProfile(token: string): Promise<any> {
  const result = await fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  return await result.json();
}
export default function Protected() {
  const { data: session, status } = useSession();

  if (session) {
    return (
      <div>
        <div>signed in</div>
        <p>email: {session.user?.email}</p>
        <p>name: {session.user?.name}</p>
        <Image src={session.user?.image!} width={100} height={100} alt="Spotify Profile Picture" />
        <button onClick={() => signOut()}>sign out</button>
      </div>
    );
  }

  return (
    <div>
      <div>not signed in</div>
      <button onClick={() => signIn()}>sign in</button>
    </div>
  );
}
