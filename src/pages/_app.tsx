import { AppProps } from 'next/app';
import { createContext } from 'react';
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

import { User } from '@/types/user';

export const GlobalContext = createContext<GlobalAuth>({
  isSchoolSelected: false,
  isVerifySchool: false,
  user: {} as User,
});

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

interface GlobalAuth {
  isSchoolSelected: boolean;
  isVerifySchool: boolean;
  user: User;
}

export default MyApp;
