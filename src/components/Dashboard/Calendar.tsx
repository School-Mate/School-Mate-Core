import dayjs from 'dayjs';
import React from 'react';

import Calendar from '@/components/Calendar/Calendar';

dayjs.locale('ko');

const WigetCalendar: React.FC<{ todos: any[] }> = ({ todos }) => {
  return (
    <>
      <div className='mt-4 flex h-[220px] flex-row items-center rounded-[10px] border bg-white px-6 py-4'>
        <div className='flex h-full w-full min-w-[110px] flex-col'>
          <div className='flex flex-col justify-between'>
            <h4 className='text-lg'>{dayjs().format('dddd')}</h4>
            <h3 className='text-4xl'>{dayjs().format('D')}</h3>
          </div>
          {/* <div className='mb-2 mt-auto flex h-[90px] flex-col justify-between'>
            {todos.map((todo, index) => (
              <TodoList todo={todo} key={index} />
            ))}
          </div> */}
        </div>
        <div className='flex h-full w-full flex-col justify-between'>
          <h5 className='text-lg font-bold'>{dayjs().format('M')}월</h5>
          <Calendar />
        </div>
      </div>
    </>
  );
};

const TodoList: React.FC<{ todo: any }> = ({ todo }) => {
  return (
    <>
      <div className='flex flex-row'>
        <div
          className='mr-2 flex w-[4px] flex-row rounded'
          style={{
            backgroundColor: todo.color ? todo.color : '#95BB72',
          }}
        />
        <p className='max-w-[95px] overflow-hidden overflow-ellipsis whitespace-nowrap'>
          {todo.title}
        </p>
      </div>
    </>
  );
};

export default WigetCalendar;
