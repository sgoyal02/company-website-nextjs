import '@/styles/global.css';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import ErrorWrap from '@/components/shared/ErrorWrap';
import { AppInitProps } from '@/types';
import { fetchStrapi } from '@/lib/strapi';

export default function MyApp({ Component, pageProps ,settings }: AppProps & AppInitProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Layout settings={settings}>
        <ErrorWrap>
        <Component {...pageProps} />
        </ErrorWrap>
      </Layout>
    </QueryClientProvider>
  );
}

MyApp.getInitialProps= async() => {
  try {
    const res = await fetchStrapi('site-setting?populate=*');
    return {settings: res.data};
  } catch(err) {
    console.error("Fail in app site setting: ", err);
    return {settings: null};
  }
};