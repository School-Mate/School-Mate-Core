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
    <header className='sticky top-0 z-50 border-b bg-white'>
      <div className='layout flex h-14 items-center justify-between'>
        <Link href='/' className='flex cursor-pointer flex-row items-center'>
          <NextImage
            src='/svg/Logo.svg'
            alt='logo'
            width={40}
            height={40}
            className='cursor-pointer drop-shadow-xl'
          />
          <span className='ml-3 text-xl font-semibold'>schoolmate</span>
        </Link>
        <nav className='flex flex-row items-center space-x-6 text-[#939393]'>
          {links.map(({ href, label }) => (
            <a>{label}</a>
          ))}
        </nav>
      </div>
    </header>
  );
}
