import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import NextNProgress from 'nextjs-progressbar';
import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { SWRConfig } from 'swr';
import 'dayjs/locale/ko';
import 'swiper/css';
import 'swiper/css/navigation';

import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.css';
import '@/styles/colors.css';
import '@/styles/schoolmate.css';

import { swrfetcher } from '@/lib/client';
import * as gtag from '@/lib/googleAnalytics';

import Footer from '@/components/Footer';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <SWRConfig
      value={{
        fetcher: swrfetcher,
        onError: (err) => {
          console.error(err);
        },
      }}
    >
      <NextNProgress
        color='#87ab69'
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
      <Component {...pageProps} />
      <Footer />
      <ToastContainer />
    </SWRConfig>
  );
}
export default MyApp;
