import dayjs from 'dayjs';
import useSWR from 'swr';

import Loading from '@/components/Loading';

import { IMealInfoRow, School } from '@/types/school';

interface WigetMealProps {
  school: School;
}

const mealType = (returnType: 'number' | 'string') =>
  dayjs().hour() < 9
    ? returnType === 'number'
      ? '1'
      : '조식'
    : dayjs().hour() < 14
    ? returnType === 'number'
      ? '2'
      : '중식'
    : returnType === 'number'
    ? '3'
    : '석식';

const WigetMeal: React.FC<WigetMealProps> = ({ school }) => {
  const {
    data: mealData,
    mutate: mutateMealData,
    error: mealDataError,
    isLoading: isMealLoading,
  } = useSWR<IMealInfoRow[]>(
    `/school/${school.schoolId}/meals?date=${dayjs().format(
      'YYYY-MM-DD'
    )}&mealType=${mealType('number')}`
  );

  return (
    <>
      <div className='flex h-[172px] w-full flex-col items-center justify-center rounded-[10px] border bg-white'>
        <h2 className='text-sm font-semibold'>
          [오늘의메뉴 - {mealType('string')}]
        </h2>
        <div className='mt-1 flex h-[100px] flex-col items-center justify-center px-5 text-center text-sm'>
          {!mealDataError && !mealData ? (
            <Loading className='h-[80px] w-[80px]' />
          ) : (
            <>
              {mealDataError || !mealData ? (
                <p>오늘의 {mealType('string')} 정보가 없습니다</p>
              ) : (
                <div
                  className='overflow-scroll'
                  style={{
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                  }}
                >
                  {mealData[0].DDISH_NM?.split('<br/>').map((meal, index) => (
                    <p key={index}>
                      {meal.replace(
                        meal.split(' ')[meal.split(' ').length - 1],
                        ''
                      )}
                    </p>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default WigetMeal;
