import Link from 'next/link';

import NextImage from '@/components/NextImage';

import { User, UserSchoolWithUser } from '@/types/user';

interface HeaderProps {
  user: User;
  school: UserSchoolWithUser;
}

const Header: React.FC<HeaderProps> = ({ user, school }) => {
  return (
    <>
      <header className='mx-auto my-12 flex h-16 max-w-[1135px] flex-row items-center justify-between'>
        <div className='flex flex-row items-center justify-center'>
          <Link
            className='mr-4 flex flex-row items-center justify-center'
            href='/'
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src='/svg/Logo.svg'
              alt='logo'
              className='h-[60px] w-[60px] lg:h-[80px] lg:w-[80px]'
              style={{
                filter: 'drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.2))',
              }}
            />
            <div className='ml-3 flex flex-col -space-y-1'>
              <span
                style={{
                  fontFamily: 'Inter',
                }}
                className='text-lg font-semibold'
              >
                schoolmate
              </span>
              <span
                style={{
                  fontFamily: 'Inter',
                }}
                className='text-3xl font-bold'
              >
                {school.school.kndsc === '고등학교'
                  ? school.school.name
                    ? school.school.name
                    : school.school.defaultName?.replace(/고등학교$/, '고')
                  : ''}
                {school.school.kndsc === '중학교'
                  ? school.school.name
                    ? school.school.name
                    : school.school.defaultName?.replace(/고등학교$/, '고')
                  : ''}
              </span>
            </div>
          </Link>
          <input
            className='border-schoolmate-500 focus:border-schoolmate-500 h-[64px] w-[650px] rounded-[58px] border-[2px] px-7 text-2xl focus:outline-none focus:ring-0'
            type='text'
            placeholder='검색어를 입력해주세요.'
          />
        </div>
        <div className='h-[65px]'>
          {user.profile ? (
            <>
              <Link href='/auth/me'>
                <NextImage
                  src={process.env.NEXT_PUBLIC_S3_URL + '/' + user.profile}
                  alt='profile'
                  width={65}
                  height={65}
                  className='h-[65px] w-[65px] overflow-hidden rounded-full'
                  imgClassName='h-[65px] w-[65px] object-cover'
                />
              </Link>
            </>
          ) : (
            <>
              <Link href='/auth/me'>
                <NextImage
                  src='/images/profile.jpg'
                  alt='profile'
                  width={65}
                  height={65}
                  className='h-[65px] w-[65px] overflow-hidden rounded-full'
                />
              </Link>
            </>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
