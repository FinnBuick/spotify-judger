import { useSession } from 'next-auth/react';
import Navbar from './navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  return (
    <div className="overflow-hidden h-screen flex flex-col">
      {session && <Navbar />}
      <main className="flex flex-grow overflow-auto">{children}</main>
    </div>
  );
}
