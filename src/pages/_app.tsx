import { AppProps } from 'next/app';
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

import Footer from '@/components/Footer';

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
      <Footer />
      <ToastContainer />
    </SWRConfig>
  );
}
export default MyApp;
