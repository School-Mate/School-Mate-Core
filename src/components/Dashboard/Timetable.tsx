import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import React from "react";
import useSWR from "swr";
dayjs.extend(isBetween);

import { UserSchoolWithUser } from "@/types/user";

interface WidgetTimeTableProps {
  userSchool: UserSchoolWithUser;
}

const WidgetTimeTable: React.FC<WidgetTimeTableProps> = ({ userSchool: user }) => {
  const {
    data: timeTableData,
    mutate: mutateTimeTableData,
    error: timeTableDataError,
    isLoading: isTimeTableLoading,
  } = useSWR<any[]>(
    `/school/${user.schoolId}/timetable?grade=${user.grade}&class=${user.class}&date=${dayjs().format(
      'YYYY-MM-DD')}`
  );

  return (
    <>
      <div className='flex h-[330px] w-full flex-col items-center justify-center rounded-[20px] border bg-white'>
        <h2 className='text-sm font-semibold'>[{user.grade}-{user.class} 시간표]</h2>
        <div className="mt-1 flex h-[100px] flex-col items-center justify-center px-5 text-center text-sm">
          {timeTableDataError || !timeTableData ? (
            <p>시간표 정보가 없습니다</p>
          ) : (
            <div></div>
          )}
        </div>
      </div >
    </>
  );
}

export default WidgetTimeTable;