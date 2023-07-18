import Router from 'next/router';
import React from 'react';

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
          <div
            className='relative h-[55px] w-[55px] rounded-full border border-[#D8D8D8]'
            style={{
              backgroundImage: askedUser.user.profile
                ? `url(${
                    process.env.NEXT_PUBLIC_S3_URL +
                    '/' +
                    askedUser.user.profile
                  })`
                : `url(/svg/CloverGray.svg)`,
              backgroundColor: '#F1F1F1',
              backgroundSize: askedUser.user.profile ? 'cover' : '30px 30px',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
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
