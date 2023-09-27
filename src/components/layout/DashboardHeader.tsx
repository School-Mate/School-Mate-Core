import Link from 'next/link';
import Router from 'next/router';
import { useState } from 'react';
import { useDetectClickOutside } from 'react-detect-click-outside';

import { UserSchoolWithUser } from '@/types/user';

interface HeaderProps {
  school: UserSchoolWithUser;
}

const Header: React.FC<HeaderProps> = ({ school }) => {
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleOnEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      Router.push(`/search?keyword=${searchKeyword}`);
    }
  };

  const refUser = useDetectClickOutside({
    onTriggered: () => setShowInfo(false),
  });

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
                {school.school.type === '고등학교'
                  ? school.school.name
                    ? school.school.name
                    : school.school.defaultName?.replace(/고등학교$/, '고')
                  : ''}
                {school.school.type === '중학교'
                  ? school.school.name
                    ? school.school.name
                    : school.school.defaultName?.replace(/중학교$/, '중')
                  : ''}
              </span>
            </div>
          </Link>
          <input
            className='border-schoolmate-500 focus:border-schoolmate-500 h-[64px] w-[650px] rounded-[58px] border-[2px] px-7 text-2xl focus:outline-none focus:ring-0'
            type='text'
            placeholder='검색어를 입력해주세요.'
            value={searchKeyword}
            onChange={handleKeywordChange}
            onKeyDown={handleOnEnter}
          />
        </div>
        <div
          className='border-schoolmate-500 relative ml-2 h-[60px] w-[60px] cursor-pointer rounded-[20px] border-2 p-3'
          onFocus={() => setShowInfo(true)}
          onClick={() => {
            setShowInfo(!showInfo);
          }}
          onBlur={() => setShowInfo(false)}
          ref={refUser}
        >
          <img
            src='/svg/User.svg'
            alt='user'
            className='mx-auto h-full w-full'
            style={{
              filter: 'drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.2))',
            }}
          />

          {showInfo && (
            <div className='absolute -bottom-[80px] right-0 flex w-40 flex-col rounded-[10px] border bg-white drop-shadow-lg transition-all'>
              <Link
                className='flex h-9 flex-row items-center rounded-t-[10px] px-3 py-1 text-sm hover:bg-gray-100'
                href='/auth/me'
              >
                <img
                  src='/svg/User.svg'
                  alt='user'
                  className='mr-2 h-6 w-6'
                  style={{
                    filter:
                      'invert(60%) sepia(62%) saturate(0%) hue-rotate(273deg) brightness(95%) contrast(88%)',
                  }}
                />
                내 정보
              </Link>
              <Link
                className='text- flex h-9 flex-row items-center rounded-b-[10px] px-3 py-1 text-sm hover:bg-gray-100'
                href='/asked/me'
              >
                <img
                  src='/svg/ChatAdd.svg'
                  alt='ChatAdd'
                  className='mr-2 h-6 w-6'
                  style={{
                    filter:
                      'invert(60%) sepia(62%) saturate(0%) hue-rotate(273deg) brightness(95%) contrast(88%)',
                  }}
                />
                에스크
              </Link>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
