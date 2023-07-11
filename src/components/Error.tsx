import LottieAnimaition from '@/components/LottieAnimaition';

import Seo from './Seo';

const Error: React.FC<ErrorPageProps> = ({ message, children }) => {
  return (
    <>
      <Seo title={message} />
      <div
        className='flex h-full min-h-[100vh] w-full flex-col items-center justify-center'
        style={{ fontFamily: 'Noto Sans KR' }}
      >
        <LottieAnimaition
          className='h-52 w-52'
          animation={require('@/lottieFiles/error.json')}
        />
        <span className='px-2 text-xl font-bold lg:text-2xl'>{message}</span>
        <div className='mt-2'>{children}</div>
      </div>
    </>
  );
};

interface ErrorPageProps {
  message: string;
  children?: React.ReactNode;
}

export default Error;
