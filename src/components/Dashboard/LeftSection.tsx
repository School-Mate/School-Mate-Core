import { NextPage } from 'next';
import * as React from 'react';

import clsxm from '@/lib/clsxm';

import Advertisement from '@/components/Advertisement';
import BoardItemButton from '@/components/BoardItem';
import Asked from '@/components/Dashboard/Asked';

interface DashboardLeftSectionProps {
  articles: any[];
  askeds: any[];
}

const DashboardLeftSection: NextPage<DashboardLeftSectionProps> = ({
  articles,
  askeds,
}) => {
  const [selectedBoard, setSelectedBoard] = React.useState<
    'board' | 'asked' | 'planner'
  >('board');
  return (
    <>
      <div className='flex w-full flex-col space-y-8'>
        <div className='flex w-full max-w-[874px] flex-col rounded-[20px] border-2 border-[#E3E5E8] p-5'>
          <div className='flex flex-row'>
            <SelectBoardButton
              isSelected={selectedBoard === 'board'}
              onClick={() => {
                setSelectedBoard('board');
              }}
            >
              게시판
            </SelectBoardButton>
            <span className='mx-3 text-xl font-bold text-[#BEBEBE]'>/</span>
            <SelectBoardButton
              isSelected={selectedBoard === 'asked'}
              onClick={() => {
                setSelectedBoard('asked');
              }}
            >
              에스크
            </SelectBoardButton>
            <span className='mx-3 text-xl font-bold text-[#BEBEBE]'>/</span>
            <SelectBoardButton
              isSelected={selectedBoard === 'planner'}
              onClick={() => {
                setSelectedBoard('planner');
              }}
            >
              플래너
            </SelectBoardButton>
          </div>
          <div className='mt-4 flex flex-row'>
            <div className='flex h-[280px] w-full max-w-[474px] flex-col justify-between'>
              {articles.slice(0, 3).map((article, index) => (
                <BoardItemButton
                  key={index}
                  title={article.title}
                  content={article.content}
                  createdAt={article.createdAt}
                  isAnonymous={article.isAnonymous}
                  user={article.user}
                  board={article.board}
                  titleImage={article.titleImage}
                />
              ))}
            </div>
            <div className='ml-5 w-full rounded-[10px] border'></div>
          </div>
          <div className='my-6 w-full border' />
          <Advertisement />
        </div>
        <div className='relative flex w-full max-w-[874px] flex-row justify-between rounded-[20px] border-2 border-[#E3E5E8] p-5'>
          <button
            className={clsxm(
              'text-xl font-bold',
              'hover:text-[#BEBEBE]',
              'bottom-[50%] top-[50%] flex -translate-y-1/2 transform flex-row items-center bg-white',
              'absolute right-1 flex h-9 w-9 rounded-full border border-[#BEBEBE]'
            )}
          >
            <i className='fas fa-chevron-right mx-auto text-lg' />
          </button>
          {askeds.slice(0, 3).map((asked, index) => (
            <Asked user={asked.user} title={asked.title} key={index} />
          ))}
        </div>
      </div>
    </>
  );
};

type SelectBoardButtonProps = {
  isSelected: boolean;
} & React.ComponentPropsWithRef<'button'>;

const SelectBoardButton = React.forwardRef<
  HTMLButtonElement,
  SelectBoardButtonProps
>(
  (
    { children, className, disabled: buttonDisabled, isSelected, ...rest },
    ref
  ) => {
    return (
      <>
        <button
          className={clsxm(
            'text-xl font-bold',
            isSelected ? 'text-black' : 'text-[#BEBEBE] hover:text-[#BEBEBE]'
          )}
          ref={ref}
          {...rest}
        >
          {children}
        </button>
      </>
    );
  }
);

export default DashboardLeftSection;
