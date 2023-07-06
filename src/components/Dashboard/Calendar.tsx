import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import Calendar from '@/components/Calendar/Calendar';

dayjs.locale('ko');

const WigetCalendar: React.FC<{ todo: any[] }> = ({ todo }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
  }, []);
  return (
    <>
      <div className='my-3 flex flex-row rounded-[10px] border bg-white px-6 py-5'>
        <div className='flex w-full min-w-[130px] flex-col'>
          <h4 className='text-lg'>{dayjs().format('dddd')}</h4>
          <h3 className='text-4xl'>{dayjs().format('D')}</h3>
          <div className='flex flex-col'></div>
        </div>
        <div className='flex w-full flex-col'>
          <h5 className='text-lg font-bold'>{dayjs().format('M')}월</h5>
          {isLoading && <Calendar />}
        </div>
      </div>
    </>
  );
};

const TodoList: React.FC = () => {
  return <></>;
};

export default WigetCalendar;
