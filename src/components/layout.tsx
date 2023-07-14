import { useSession } from 'next-auth/react';
import Navbar from './navbar';
import Footer from './footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col min-h-screen">
      {session && <Navbar />}
      <main className="flex-1 flex flex-col justify-center">{children}</main>
      <Footer />
    </div>
  );
}
