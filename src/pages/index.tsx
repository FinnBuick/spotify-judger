import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (session) {
    router.push('/protected');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-2xl p-8">
        <div className="text-center">
          <Image className="mx-auto" src="/Spotify_logo_without_text.svg" alt="Spotify Logo" width={64} height={64} />
          <h1 className="text-bg mt-6 text-8xl font-semibold">Spotify Judger</h1>
          <p className="mt-4 text-slate-900">Get your Spotify listening history judged by OpenAI&apos;s GPT-3.</p>
        </div>

        <div className="flex justify-center">
          <button
            className="m-auto mt-6 w-2/3 rounded-lg bg-green-500 px-6 py-3 text-white hover:bg-green-600"
            onClick={() => signIn('spotify', { callbackUrl: 'http://localhost:3000/protected' })}
          >
            Login with Spotify
          </button>
        </div>
      </div>

      <div className="blob-cont">
        <div className="yellow blob"></div>
        <div className="red blob"></div>
        <div className="green blob"></div>
      </div>

      <svg>
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch" />
          <feColorMatrix in="colorNoise" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" />
          <feComposite operator="in" in2="SourceGraphic" result="monoNoise" />
          <feBlend in="SourceGraphic" in2="monoNoise" mode="screen" />
        </filter>
      </svg>
    </main>
  );
}
