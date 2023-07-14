import React from 'react';

import clsxm from '@/lib/clsxm';
import { schoolMateDateFormat } from '@/lib/utils';

import NextImage from '@/components/NextImage';

import { Article } from '@/types/article';

interface BoardItem {
  article: Article;
}

type BoardItemProps = BoardItem & React.ComponentPropsWithRef<'button'>;

const BoardItemButton = React.forwardRef<HTMLButtonElement, BoardItemProps>(
  (
    { children, className, disabled: buttonDisabled, article, ...rest },
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
              {article.title}
            </h1>
            <p className='text-[9.5pt] leading-[20px] text-[#8D8D8D]'>
              {article.content.length > 20
                ? article.content.slice(0, 20) + '...'
                : article.content}
            </p>
            <h3 className='flex flex-row items-center justify-center text-[8pt] font-normal leading-[18px] text-[#707070]'>
              <span>{schoolMateDateFormat(article.createdAt)}</span>
              <span className='mx-1 text-[14pt]'>&#183;</span>
              <span>
                {article.isAnonymous || !article.User
                  ? '익명'
                  : article.User.name}
              </span>
              <span className='mx-2'>{article.Board.name}</span>
            </h3>
          </div>
          <div>
            {article.images[0] && (
              <NextImage
                src={
                  process.env.NEXT_PUBLIC_S3_URL + '/' + article.keyOfImages[0]
                }
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
