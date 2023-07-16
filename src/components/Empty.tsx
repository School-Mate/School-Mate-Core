import clsxm from '@/lib/clsxm';

import LottieAnimaition from '@/components/LottieAnimaition';

interface EmptyProps {
  className?: string;
  textClassName?: string;
}

const Empty: React.FC<EmptyProps> = ({ className, textClassName }) => {
  return (
    <>
      <div className={clsxm('h-full w-full')}>
        <div className='flex h-full flex-col items-center justify-center'>
          <LottieAnimaition
            className={clsxm('-mb-20 -mt-20 h-96 w-96', className)}
            animation={require('@/lottieFiles/empty.json')}
          />
          <h1
            className={clsxm('text-center text-2xl font-bold', textClassName)}
          >
            오..이런! 아무것도 없네요ㅠ.ㅠ
          </h1>
        </div>
      </div>
    </>
  );
};

export default Empty;
