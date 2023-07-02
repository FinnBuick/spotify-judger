import Layout from '@/components/layout';
import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
      <Toaster />
    </SessionProvider>
  );
}
