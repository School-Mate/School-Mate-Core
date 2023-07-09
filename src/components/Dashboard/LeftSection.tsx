import { NextPage } from 'next';
import Link from 'next/link';
import * as React from 'react';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

import clsxm from '@/lib/clsxm';

import Advertisement from '@/components/Advertisement';
import BoardItemButton from '@/components/BoardItem';
import Asked from '@/components/Dashboard/Asked';

interface DashboardLeftSectionProps {
  articles: any[];
  askeds: any[];
  boards: any[];
}

const DashboardLeftSection: NextPage<DashboardLeftSectionProps> = ({
  articles,
  askeds,
  boards,
}) => {
  const [askSwiper, setAskSwiper] = React.useState<SwiperClass>();
  const [askedIndex, setAskedIndex] = React.useState<number>(0);
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
            <div className='mr-8 flex h-[280px] w-full max-w-[474px] flex-col justify-between'>
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
            <div className='grid w-[318px] grid-cols-2 rounded-[10px] border py-6'>
              <div className='flex flex-col space-y-4 border-r px-4'>
                {boards.slice(0, 6).map((board, index) => (
                  <>
                    <Link
                      href={`/board/${board.id}`}
                      key={index}
                      className='text-base'
                    >
                      {board.name}
                    </Link>
                  </>
                ))}
              </div>
              <div className='flex flex-col space-y-4 px-4'>
                {boards.slice(6, 12).map((board, index) => (
                  <>
                    <Link
                      href={`/board/${board.id}`}
                      key={index}
                      className='text-base'
                    >
                      {board.name}
                    </Link>
                  </>
                ))}
              </div>
            </div>
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
              'absolute left-1 z-10 flex h-9 w-9 rounded-full border border-[#BEBEBE]',
              askedIndex === 0 ? 'hidden' : 'block'
            )}
            onClick={() => {
              askSwiper?.slidePrev();
            }}
          >
            <i className='fas fa-chevron-left mx-auto text-lg' />
          </button>
          <button
            className={clsxm(
              'text-xl font-bold',
              'hover:text-[#BEBEBE]',
              'bottom-[50%] top-[50%] flex -translate-y-1/2 transform flex-row items-center bg-white',
              'absolute right-1 z-10 flex h-9 w-9 rounded-full border border-[#BEBEBE]'
            )}
            onClick={() => {
              askSwiper?.slideNext();
            }}
          >
            <i className='fas fa-chevron-right mx-auto text-lg' />
          </button>
          <Swiper
            slidesPerView={3}
            centeredSlides={false}
            slidesPerGroupSkip={3}
            grabCursor={true}
            keyboard={{
              enabled: true,
            }}
            navigation={false}
            pagination={{
              clickable: true,
            }}
            onSwiper={setAskSwiper}
            onSlideChange={(swiper) => {
              setAskedIndex(swiper.activeIndex);
            }}
            spaceBetween={20}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: true,
            }}
          >
            {askeds.map((asked, index) => (
              <>
                <SwiperSlide key={index}>
                  <Asked user={asked.user} title={asked.title} key={index} />
                </SwiperSlide>
              </>
            ))}
          </Swiper>
        </div>
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
