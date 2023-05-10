import Image from 'next/image';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <p>This is the home page</p>
      <Link href="/protected">Protected Route</Link>
    </main>
  );
}
