import { signIn, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-2xl mx-auto p-8">
        <div className="text-center">
          {/* <SpotifyLogo className="w-16 h-16 mx-auto text-white" /> */}
          <h1 className="text-8xl text-bg font-semibold mt-6">Spotify Judger</h1>
          <p className="text-slate-900 mt-2">Analyze your music taste and discover new insights</p>
        </div>
        <button
          className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-6 py-3 mt-6 w-full"
          onClick={() => signIn('spotify', { callbackUrl: 'http://localhost:3000/protected' })}
        >
          Login with Spotify
        </button>
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
    </div>
  );
}
