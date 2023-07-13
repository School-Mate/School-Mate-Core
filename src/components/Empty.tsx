import LottieAnimaition from '@/components/LottieAnimaition';

const Empty = () => {
  return (
    <>
      <div className='h-full w-full'>
        <div className='flex h-full flex-col items-center justify-center'>
          <LottieAnimaition
            className='-mb-20 -mt-20 h-96 w-96'
            animation={require('@/lottieFiles/empty.json')}
          />
          <h1 className='text-center text-2xl font-bold'>
            오..이런! 아무것도 없네요ㅠ.ㅠ
          </h1>
        </div>
      </div>
    </>
  );
};

export default Empty;
