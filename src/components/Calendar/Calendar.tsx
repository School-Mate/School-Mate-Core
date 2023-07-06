import { useEffect, useRef, useState } from 'react';

import CalendarRow from './CalendarRow';

const Calendar: React.FC = () => {
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth());
  const [activeMonthString, setActiveMonthString] = useState(
    new Date().toDateString().split(' ')[1]
  );
  const [activeYear, setActiveYear] = useState(new Date().getFullYear());
  const prevMonth = useRef<number>(null);
  const [firstDayInMonth, setFirstDayInMonth] = useState<number[]>([]);

  useEffect(() => {
    const x = [];
    for (let i = 1; i <= 12; i++) {
      x.push(new Date(`${activeYear}/${i}/1`).getDay());
    }
    setFirstDayInMonth(x);
  }, [activeYear]);

  useEffect(() => {
    setActiveMonthString(
      new Date(new Date().setMonth(activeMonth)).toDateString().split(' ')[1]
    );
    //remember previous activeMonth
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    prevMonth.current = activeMonth;
  }, [activeMonth]);

  return (
    <div className='bg-white'>
      <div className='w-full rounded'>
        <div>
          <table className='w-full dark:text-white'>
            <thead>
              <tr>
                <th className='text-sm text-[#FC3E3E]'>일</th>
                <th className='text-sm'>월</th>
                <th className='text-sm'>화</th>
                <th className='text-sm'>수</th>
                <th className='text-sm'>목</th>
                <th className='text-sm'>금</th>
                <th className='text-sm'>토</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <CalendarRow
                  firstDay={firstDayInMonth[activeMonth]}
                  lastDayInMonth={new Date(
                    activeYear,
                    activeMonth + 1,
                    0
                  ).getDate()}
                  row={0}
                  currentMonth={activeMonth}
                  currentYear={activeYear}
                />
              </tr>
              <tr>
                <CalendarRow
                  firstDay={firstDayInMonth[activeMonth]}
                  lastDayInMonth={new Date(
                    activeYear,
                    activeMonth + 1,
                    0
                  ).getDate()}
                  row={1}
                  currentMonth={activeMonth}
                  currentYear={activeYear}
                />
              </tr>
              <tr>
                <CalendarRow
                  firstDay={firstDayInMonth[activeMonth]}
                  lastDayInMonth={new Date(
                    activeYear,
                    activeMonth + 1,
                    0
                  ).getDate()}
                  row={2}
                  currentMonth={activeMonth}
                  currentYear={activeYear}
                />
              </tr>
              <tr>
                <CalendarRow
                  firstDay={firstDayInMonth[activeMonth]}
                  lastDayInMonth={new Date(
                    activeYear,
                    activeMonth + 1,
                    0
                  ).getDate()}
                  row={3}
                  currentMonth={activeMonth}
                  currentYear={activeYear}
                />
              </tr>
              <tr>
                <CalendarRow
                  firstDay={firstDayInMonth[activeMonth]}
                  lastDayInMonth={new Date(
                    activeYear,
                    activeMonth + 1,
                    0
                  ).getDate()}
                  row={4}
                  currentMonth={activeMonth}
                  currentYear={activeYear}
                />
              </tr>
              <tr>
                <CalendarRow
                  firstDay={firstDayInMonth[activeMonth]}
                  lastDayInMonth={new Date(
                    activeYear,
                    activeMonth + 1,
                    0
                  ).getDate()}
                  row={5}
                  currentMonth={activeMonth}
                  currentYear={activeYear}
                />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
