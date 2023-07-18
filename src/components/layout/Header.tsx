import * as React from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';
import NextImage from '@/components/NextImage';
import Link from 'next/link';

const links = [
  { href: '/', label: 'Route 1' },
  { href: '/', label: 'Route 2' },
];

export default function Header() {
  return (
    <header className='sticky top-0 z-50 bg-white'>
      <div className='mx-14 flex h-20 items-center justify-between'>
        <Link
          href='/'
          className='flex cursor-pointer flex-row items-center justify-center'
        >
          <NextImage
            src='/svg/Logo.svg'
            alt='logo'
            width={50}
            height={50}
            className='cursor-pointer drop-shadow-xl'
          />
          <span
            className='ml-3 text-3xl font-semibold'
            style={{
              fontFamily: 'Fredoka',
            }}
          >
            schoolmate
          </span>
        </Link>
        <nav className='flex flex-row items-center space-x-6'>
          <Link href='/auth/login'>로그인</Link>
          <Link
            href='/auth/register'
            className='bg-schoolmate-500 rounded-[5px] px-5 py-1.5 font-bold text-white'
          >
            스쿨메이트 회원가입
          </Link>
        </nav>
      </div>
    </header>
  );
}
