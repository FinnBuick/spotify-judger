import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <p>This is the home page</p>
      <Link href="/protected" className="link link-primary">
        Protected Route
      </Link>
    </main>
  );
}
