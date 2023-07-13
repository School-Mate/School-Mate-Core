import LottieAnimaition from '@/components/LottieAnimaition';

const Loading = ({ className }: { className?: string }) => {
  return (
    <>
      <div className={'flex h-32 w-32 items-center justify-center' + className}>
        <LottieAnimaition
          animation={require('@/lottieFiles/loading.json')}
          className='h-full w-full'
          speed={2.5}
        />
      </div>
    </>
  );
};

export const LoadingScreen = () => {
  return (
    <>
      <div
        id='loading'
        className='fixed left-0 top-0 h-full w-full backdrop-blur-sm'
        style={{
          transition: 'all .3s ease',
          zIndex: 1000,
          background: 'rgba(0,0,0,.3)',
        }}
      >
        <div className='flex h-full items-center justify-center opacity-100'>
          <LottieAnimaition
            speed={2.5}
            animation={require('@/lottieFiles/loading.json')}
            className='h-64 w-64 p-12'
          />
        </div>
      </div>
    </>
  );
};

export default Loading;
