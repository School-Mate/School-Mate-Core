import { AxiosError } from 'axios';
import { AppContext, AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { getSession, SessionProvider } from 'next-auth/react';
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

import client from '@/lib/client';
import * as gtag from '@/lib/googleAnalytics';

import Footer from '@/components/Footer';

function MyApp({ Component, pageProps }: AppProps) {
  client.defaults.headers.common['Authorization'] =
    'Bearer ' + pageProps.session?.user?.token.accessToken;
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
    <SessionProvider>
      <SWRConfig
        value={{
          fetcher: (resource) =>
            client
              .get(resource, {
                headers: {
                  Authorization: `Bearer ${pageProps.session?.user?.token.accessToken}`,
                },
              })
              .then((data) => data.data.data)
              .catch((e: AxiosError) => {
                const response = e.response as unknown as {
                  data: { message: string };
                };

                throw new Error(
                  response?.data?.message || '알 수 없는 에러가 발생했습니다.'
                );
              }),
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
    </SessionProvider>
  );
}

// getInitialProps
MyApp.getInitialProps = async ({ Component, ctx }: AppContext) => {
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {};

  const session = await getSession(ctx);

  return { pageProps: { ...pageProps, session } };
};

export default MyApp;
