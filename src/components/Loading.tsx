import LottieAnimaition from '@/components/LottieAnimaition';

const Loading = () => {
  return (
    <>
      <div className='h-30 w-30 flex items-center justify-center'>
        <LottieAnimaition
          animation={require('@/lottieFiles/loading.json')}
          className='h-full w-full'
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
            animation={require('@/lottieFiles/loading.json')}
            className='h-64 w-64 p-12'
          />
        </div>
      </div>
    </>
  );
};

export default Loading;
