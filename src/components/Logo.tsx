import Link from 'next/link';
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Link
      href='/'
      className={`flex h-14 flex-row items-center justify-center ${
        className ? className : ''
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src='/svg/Logo.svg'
        alt='logo'
        className='h-[45px] w-[50px] lg:h-[70px] lg:w-[70px]'
        style={{
          filter: 'drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.2))',
        }}
      />
      <span
        style={{
          fontFamily: 'Fredoka',
        }}
        className='ml-5 text-[20pt] font-semibold lg:text-[30pt]'
      >
        schoolmate
      </span>
    </Link>
  );
};

export default Logo;
