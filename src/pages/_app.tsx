import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { SWRConfig } from 'swr';

import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.css';
import '@/styles/colors.css';
import '@/styles/schoolmate.css';

import { swrfetcher } from '@/lib/client';

/**
 * !STARTERCONF info
 * ? `Layout` component is called in every page using `np` snippets. If you have consistent layout across all page, you can add it here too
 */

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: swrfetcher,
        onError: (err) => {
          console.error(err);
        },
      }}
    >
      <Component {...pageProps} />
      <ToastContainer />
    </SWRConfig>
  );
}

export default MyApp;
