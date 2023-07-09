import LottieAnimaition from '@/components/LottieAnimaition';

const Loading = () => {
  return (
    <>
      <div className='flex h-14 w-14 items-center justify-center'>
        <LottieAnimaition
          animation={require('@/lottieFiles/loading.json')}
          className='h-full w-full'
        />
      </div>
    </>
  );
};

export default Loading;
