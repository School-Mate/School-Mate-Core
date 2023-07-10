import * as React from 'react';

import WigetBus from '@/components/Dashboard/Bus';
import WigetCalendar from '@/components/Dashboard/Calendar';
import WigetMeal from '@/components/Dashboard/Meal';

import { School } from '@/types/school';
import { User } from '@/types/user';

interface DashboardRightSectionProps {
  user: User;
  school: School;
  todos: any[];
}

const DashboardRightSection: React.FC<DashboardRightSectionProps> = ({
  school,
  user,
  todos,
}) => {
  return (
    <>
      <div className='ml-6 h-full w-full max-w-[383px] rounded-[20px] border-2 border-[#E3E5E8] bg-[#F9F9F9] p-5'>
        <div className='flex flex-col'>
          <span className='text-xl font-bold'>위젯 보드</span>
          <div className='flex flex-col'>
            <WigetCalendar
              todos={[
                {
                  title: '수학 숙제',
                  color: '#FF0000',
                },
                {
                  title: '과학 숙제asdasdasdasdadssd',
                },
                {
                  title: '과학 숙제',
                },
              ]}
            />
            <div className='mt-4 flex flex-row justify-between space-x-5'>
              <WigetMeal school={school} />
              <WigetBus school={school} user={user} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardRightSection;
