import React from 'react';

import { schoolMateDateFormat } from '@/lib/utils';

import NextImage from '@/components/NextImage';

import { User } from '@/types/user';

const Asked: React.FC<{
  user: User;
  title: string;
}> = ({ user, title }) => {
  return (
    <>
      <div className='w-full max-w-[260px] rounded-[10px] border p-6'>
        <div className='flex flex-row items-center'>
          <NextImage
            src={user.profile ? user.profile : '/images/profile.jpg'}
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
          <div className='ml-3 flex flex-col'>
            <h1 className='text-lg font-bold'>{user.name}</h1>
            <h2 className='-mt-1 text-sm font-normal text-[#707070]'>
              {schoolMateDateFormat(new Date())}
            </h2>
          </div>
        </div>
        <p className='mt-4 overflow-hidden text-ellipsis whitespace-nowrap text-[11pt] leading-[18px]'>
          {title}
        </p>
      </div>
    </>
  );
};

export default Asked;
