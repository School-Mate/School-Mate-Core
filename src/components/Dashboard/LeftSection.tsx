import { NextPage } from 'next';
import * as React from 'react';

import clsxm from '@/lib/clsxm';

import Advertisement from '@/components/Advertisement';
import BoardItemButton from '@/components/BoardItem';

interface DashboardLeftSectionProps {
  articles: any[];
}

const DashboardLeftSection: NextPage<DashboardLeftSectionProps> = ({
  articles,
}) => {
  const [selectedBoard, setSelectedBoard] = React.useState<
    'board' | 'asked' | 'planner'
  >('board');
  return (
    <>
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
          <span className='mx-3 text-lg font-bold text-[#BEBEBE]'>/</span>
          <SelectBoardButton
            isSelected={selectedBoard === 'asked'}
            className='text-lg font-bold'
            onClick={() => {
              setSelectedBoard('asked');
            }}
          >
            에스크
          </SelectBoardButton>
          <span className='mx-3 text-lg font-bold text-[#BEBEBE]'>/</span>
          <SelectBoardButton
            isSelected={selectedBoard === 'planner'}
            className='text-lg font-bold'
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
