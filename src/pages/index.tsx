import { PROTECTED } from '@/common/constants';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push(PROTECTED);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="mx-auto max-w-3xl p-8">
        <div className="text-center">
          <Image className="mx-auto" src="/Spotify_logo_without_text.svg" alt="Spotify Logo" width={64} height={64} />
          <h1 className="text-bg mt-6 text-8xl font-semibold xs:text-4xl">Spotify Judger</h1>
          <p className="mt-4 text-slate-900 text-lg">
            Spotify Judger is an app that gives you feedback on your music taste from an completely unbiased AI chatbot
            with objectively exquisite taste in music.
          </p>
        </div>

        <div className="flex justify-center">
          <button
            className="m-auto mt-6 w-2/3 rounded-lg bg-green-500 px-6 py-3 text-white hover:bg-green-600"
            onClick={() => signIn('spotify', { callbackUrl: PROTECTED })}
          >
            Login with Spotify
          </button>
        </div>
      </div>

      <svg className="h-0">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch" />
          <feColorMatrix in="colorNoise" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" />
          <feComposite operator="in" in2="SourceGraphic" result="monoNoise" />
          <feBlend in="SourceGraphic" in2="monoNoise" mode="screen" />
        </filter>
      </svg>
    </div>
  );
}
