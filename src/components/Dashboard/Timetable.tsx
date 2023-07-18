import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import React from 'react';
import useSWR from 'swr';
dayjs.extend(isBetween);

import { UserSchoolWithUser } from '@/types/user';
import { ITimetableRow } from '@/types/school';
import clsxm from '@/lib/clsxm';

interface WidgetTimeTableProps {
  userSchool: UserSchoolWithUser;
}

const WidgetTimeTable: React.FC<WidgetTimeTableProps> = ({
  userSchool: user,
}) => {
  const {
    data: timeTableData,
    mutate: mutateTimeTableData,
    error: timeTableDataError,
    isLoading: isTimeTableLoading,
  } = useSWR<ITimetableRow[]>(
    `/school/${user.schoolId}/timetable?grade=${user.grade}&class=${
      user.class
    }${user.dept ? `&dept=${user.dept}` : ''}&date=${dayjs().format(
      'YYYY-MM-DD'
    )}`
  );

  return (
    <>
      <div className='flex w-full flex-col items-start rounded-[20px] border bg-white'>
        <h2 className='w-full border-b px-4 py-3 text-xl font-semibold'>
          {dayjs().format('dddd')} 시간표
        </h2>
        <div className='flex h-full w-full flex-col items-center justify-start text-center text-sm'>
          {timeTableDataError || !timeTableData ? (
            <p className='mx-auto my-auto flex h-[250px] items-center justify-center'>
              시간표 정보가 없습니다
            </p>
          ) : (
            <div className='w-full'>
              {timeTableData
                .sort((a, b) => {
                  return a.PERIO < b.PERIO ? -1 : a.PERIO > b.PERIO ? 1 : 0;
                })
                .map((timeTable, index) => (
                  <>
                    <div
                      className={clsxm(
                        'flex h-10 w-full flex-row items-start justify-between border-b px-5',
                        index === timeTableData.length - 1 ? 'border-none' : ''
                      )}
                    >
                      <p className='flex h-full w-16 items-center justify-center border-r pr-5 text-base'>
                        {timeTable.PERIO}교시
                      </p>
                      <p className='my-auto flex w-60 items-center justify-start text-ellipsis whitespace-nowrap pl-5 text-base'>
                        {timeTable.ITRT_CNTNT}
                      </p>
                    </div>
                  </>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WidgetTimeTable;
