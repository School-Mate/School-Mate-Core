import { NextPage } from 'next';
import Link from 'next/link';
import * as React from 'react';
import useSWR from 'swr';

import { swrfetcher } from '@/lib/client';
import clsxm from '@/lib/clsxm';

import Advertisement from '@/components/Advertisement';
import BoardItemButton from '@/components/BoardItem';
import Button from '@/components/buttons/Button';
import WigetAsked from '@/components/Dashboard/Asked';
import Empty from '@/components/Empty';
import Loading from '@/components/Loading';
import Tooltips from '@/components/Tooltips';

import { Article } from '@/types/article';
import { AskedUser } from '@/types/asked';
import { Board } from '@/types/board';

const DashboardLeftSection: NextPage = () => {
  const { data: askeds } = useSWR<AskedUser[]>(`/asked`, swrfetcher);
  const { data: boards } = useSWR<Board[]>(`/board`, swrfetcher);
  const { data: articles } = useSWR<Article[]>(`/board/suggest`, swrfetcher);
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
            {/* <span className='mx-3 text-xl font-bold text-[#BEBEBE]'>/</span>
            <SelectBoardButton
              isSelected={selectedBoard === 'planner'}
              onClick={() => {
                setSelectedBoard('planner');
              }}
            >
              플래너
            </SelectBoardButton> */}
          </div>
          <div className='mt-4 flex flex-row'>
            <div className='mr-8 flex h-[280px] w-full max-w-[474px] flex-col justify-between'>
              {articles ? (
                <>
                  {articles.length == 0 ? (
                    <>
                      <div className='h-[280px] overflow-hidden'>
                        <Empty
                          className='h-60 w-60'
                          textClassName='text-lg mt-5'
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {articles.slice(0, 3).map((article, index) => (
                        <BoardItemButton key={index} article={article} />
                      ))}
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className='flex h-[280px] w-full flex-col items-center justify-center'>
                    <Loading />
                  </div>
                </>
              )}
            </div>
            {boards ? (
              <>
                <div className='grid w-[318px] grid-cols-2 rounded-[10px] border py-3'>
                  <div className='flex flex-col space-y-1 border-r px-2'>
                    {boards.slice(0, 6).map((board, index) => (
                      <>
                        <Link
                          href={`/board/${board.id}`}
                          key={index}
                          className='rounded-[10px] px-2 py-2 text-base hover:bg-gray-100'
                        >
                          {board.name}
                        </Link>
                      </>
                    ))}
                  </div>
                  <div className='flex flex-col space-y-1 border-r px-2'>
                    {boards.slice(6, 11).map((board, index) => (
                      <>
                        <Link
                          href={`/board/${board.id}`}
                          key={index}
                          className='rounded-[10px] px-2 py-2 text-base hover:bg-gray-100'
                        >
                          {board.name}
                        </Link>
                      </>
                    ))}
                    <Link
                      href='/board'
                      className='text-schoolmate-500 rounded-[10px] px-2 py-2 text-base font-bold hover:bg-gray-100'
                    >
                      더보기
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className='flex w-[318px] items-center justify-center rounded-[10px] border py-6'>
                  <Loading />
                </div>
              </>
            )}
          </div>
          <div className='my-6 w-full border' />
          <Advertisement />
        </div>
        <div className='max-w-[874px] rounded-[20px] border-2 border-[#E3E5E8]'>
          <div className='mb-3 mt-4 flex flex-row items-center px-5'>
            <span className='mr-2 text-xl font-bold'>에스크 추천인</span>
            <Tooltips
              tooltip={
                <>
                  <div className='flex w-60 flex-col'>
                    <span className='text-[16pt] font-semibold'>
                      🏆 에스크 월정액
                    </span>
                    <div className='mt-2 flex flex-col text-[12pt] font-light'>
                      <span>
                        유료 월정액 유저가{' '}
                        <span className='underline'>우선순위로</span>
                      </span>
                      <span>올라오게 됩니다.</span>
                    </div>
                    <Button
                      className={clsxm(
                        'ml-auto flex h-[30px] w-20 items-center justify-center',
                        'border-none bg-sky-500 text-sm font-semibold text-white hover:bg-sky-600 active:bg-sky-700'
                      )}
                    >
                      바로가기
                    </Button>
                  </div>
                </>
              }
            >
              <div className={clsxm('flex items-center justify-center')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src='/svg/Info.svg' className='h-5 w-5' alt='info' />
              </div>
            </Tooltips>
          </div>
          {askeds ? (
            <>
              {askeds.length === 0 ? (
                <>
                  <div className='flex h-[280px] w-full items-center justify-center'>
                    <Empty
                      className='-mb-10 h-56 w-56 text-lg'
                      textClassName='text-xl'
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className='grid w-full grid-cols-3 gap-x-5 gap-y-3 px-5 pb-5'>
                    {askeds.map((asked, index) => (
                      <>
                        <WigetAsked askedUser={asked} key={index} />
                      </>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className='flex h-[280px] w-full flex-col items-center justify-center'>
                <Loading />
              </div>
            </>
          )}
          {askeds && askeds?.length > 6 && (
            <>
              <button className='h-[60px] w-full border-t font-bold'>
                펼쳐보기 <i className='fas fa-plus text-schoolmate-500'></i>
              </button>
            </>
          )}
        </div>
        {/* <div className='relative flex w-full max-w-[874px] flex-row justify-between rounded-[20px] border-2 border-[#E3E5E8] p-5'>
          {reviews?.map((review, index) => (
            <WigetReview review={review} key={index} />
          ))}
        </div> */}
      </div>
    </>
  );
};

interface SelectBoardButtonProps extends React.ComponentPropsWithRef<'button'> {
  isSelected?: boolean;
}

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
