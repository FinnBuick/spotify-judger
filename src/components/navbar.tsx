import { HOME } from '@/common/constants';
import { signOut, useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="navbar bg-transparent">
      <div className="flex-1">
        <a className="btn-ghost btn text-xl normal-case">Spotify Judger</a>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown-end dropdown">
          <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
            <div className="w-10 rounded-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {session?.user?.image && <img src={session?.user?.image} alt="Spotify profile picture" />}
            </div>
          </label>
          <ul tabIndex={0} className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow">
            <li>
              <button
                onClick={() =>
                  signOut({
                    callbackUrl: HOME,
                  })
                }
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
