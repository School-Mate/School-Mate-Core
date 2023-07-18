import Router from 'next/router';
import React from 'react';

import NextImage from '@/components/NextImage';

import { AskedUser } from '@/types/asked';

interface AskedProps {
  askedUser: AskedUser;
}

const Asked: React.FC<AskedProps> = ({ askedUser }) => {
  return (
    <>
      <div
        className='w-full max-w-[17rem] cursor-pointer rounded-[10px] border p-6'
        onClick={() => {
          Router.push(
            `/asked/${
              askedUser.customId ? askedUser.customId : askedUser.userId
            }`
          );
        }}
      >
        <div className='flex flex-row items-center'>
          <NextImage
            src={
              askedUser.user.profile
                ? process.env.NEXT_PUBLIC_S3_URL + '/' + askedUser.user.profile
                : '/images/profile.jpg'
            }
            className='h-[50px] w-[50px] overflow-hidden rounded-full'
            width={50}
            height={50}
            useSkeleton={true}
            alt='profile'
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            imgClassName='h-full'
          />
          <div className='ml-3 flex max-w-[148px] flex-col whitespace-nowrap'>
            <h1 className='w-full truncate overflow-ellipsis text-lg font-bold'>
              {askedUser.user.name}
            </h1>
            <h2 className='-mt-1 truncate overflow-ellipsis text-sm font-normal text-[#707070]'>
              @{askedUser.customId ? askedUser.customId : askedUser.user.name}
            </h2>
          </div>
        </div>
        <p className='mt-4 overflow-hidden text-ellipsis whitespace-nowrap text-[11pt] leading-[18px]'>
          {askedUser.statusMessage || '안녕하세요!'}
        </p>
      </div>
    </>
  );
};

export default Asked;
