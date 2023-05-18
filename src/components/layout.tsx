import { useSession } from 'next-auth/react';
import Navbar from './navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  return (
    <>
      {session && <Navbar />}
      <main>{children}</main>
    </>
  );
}
