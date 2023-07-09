import React from 'react';

import clsxm from '@/lib/clsxm';
import { schoolMateDateFormat } from '@/lib/utils';

import NextImage from '@/components/NextImage';

import { User } from '@/types/user';

interface BoardItem {
  title: string;
  content: string;
  board: string;
  user?: User;
  createdAt: Date;
  isAnonymous: boolean;
  titleImage?: string;
}

type BoardItemProps = BoardItem & React.ComponentPropsWithRef<'button'>;

const BoardItemButton = React.forwardRef<HTMLButtonElement, BoardItemProps>(
  (
    {
      children,
      className,
      disabled: buttonDisabled,
      title,
      content,
      user,
      isAnonymous,
      createdAt,
      board,
      titleImage,
      ...rest
    },
    ref
  ) => {
    return (
      <>
        <button
          className={clsxm(
            'bg-[#F9F9F9]] h-[82px] w-full justify-between rounded-[10px] border border-[#E3E5E8] px-4 py-3',
            'flex flex-row',
            className
          )}
          ref={ref}
          {...rest}
        >
          <div className='flex flex-col items-start'>
            <h1 className='mt-0.5 text-[11pt] font-semibold leading-[18px]'>
              {title}
            </h1>
            <p className='text-[9.5pt] leading-[20px] text-[#8D8D8D]'>
              {content.length > 20 ? content.slice(0, 20) + '...' : content}
            </p>
            <h3 className='flex flex-row items-center justify-center text-[8pt] font-normal leading-[18px] text-[#707070]'>
              <span>{schoolMateDateFormat(createdAt)}</span>
              <span className='mx-1 text-[14pt]'>&#183;</span>
              <span>{isAnonymous || !user ? '익명' : user.name}</span>
              <span className='mx-2'>{board}</span>
            </h3>
          </div>
          <div>
            {titleImage && (
              <NextImage
                src={titleImage}
                alt='image'
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                useSkeleton={true}
                width={58}
                height={58}
                imgClassName='h-full'
                className='h-[58px] w-[58px] overflow-hidden rounded-[10px] '
              />
            )}
          </div>
        </button>
      </>
    );
  }
);

export default BoardItemButton;
