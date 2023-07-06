import { useState } from 'react';

export interface CalendarRowProps {
  firstDay: number;
  lastDayInMonth: number;
  row: number;
  currentMonth: number;
  currentYear: number;
}

const CalendarRow: React.FC<CalendarRowProps> = ({
  firstDay,
  lastDayInMonth,
  row,
  currentMonth,
  currentYear,
}) => {
  const activeDay = useState(new Date().getDate())[0];

  const content = [];
  //first row with empty spaces
  if (!row) {
    for (let i = 0; i < firstDay; i++) {
      content.push(<td></td>);
    }
    content.push(
      <td className='relative text-center  text-gray-800 hover:text-blue-500'>
        1
      </td>
    );
    const len = 7 - content.length;
    for (let i = 1; i <= len; i++) {
      content.push(
        <>
          {activeDay === i + 1 &&
          new Date().getMonth() === currentMonth &&
          new Date().getFullYear() === currentYear ? (
            <td className='relative text-center  text-gray-800 hover:text-blue-500'>
              <span className='rounded-full border-2 border-green-400 p-1'>
                {i + 1}
              </span>
            </td>
          ) : (
            <td className='relative text-center  text-gray-800 hover:text-blue-500 '>
              {i + 1}
            </td>
          )}
        </>
      );
    }

    return <>{content}</>;
  }
  //other rows
  for (let i = 1; i <= 7; i++) {
    if (i + (7 * row - firstDay) <= lastDayInMonth) {
      content.push(
        <>
          {activeDay === i + (7 * row - firstDay) &&
          new Date().getMonth() === currentMonth &&
          new Date().getFullYear() === currentYear ? (
            <td className='hover:text-schoolmate-500 relative  text-center text-gray-800'>
              <span className='border-schoolmate-400 rounded-full border-2 p-1'>
                {i + (7 * row - firstDay)}
              </span>
            </td>
          ) : (
            <td className='hover:text-schoolmate-500 relative  text-center text-gray-800'>
              {i + (7 * row - firstDay)}
            </td>
          )}
        </>
      );
    }
  }
  return <>{content}</>;
};

export default CalendarRow;
