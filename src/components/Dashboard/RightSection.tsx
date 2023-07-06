import * as React from 'react';

import WigetCalendar from '@/components/Dashboard/Calendar';

const DashboardRightSection = () => {
  return (
    <>
      <div className='ml-6 h-full w-full max-w-[383px] rounded-[20px] border-2 border-[#E3E5E8] bg-[#F9F9F9] p-5'>
        <div className='flex flex-col'>
          <span className='text-xl font-bold'>위젯 보드</span>
          <div className=''>
            <WigetCalendar todo={[{}]} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardRightSection;
