import useUser from '@/lib/hooks/useUser';

import NextImage from '@/components/NextImage';

const Header = () => {
  const { user } = useUser();

  return (
    <>
      <header className='mx-auto my-12 flex h-16 max-w-[1210px] flex-row items-center justify-between'>
        <div className='flex flex-row items-center justify-center'>
          <div className='mr-4 flex flex-row items-center justify-center'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src='/svg/Logo.svg'
              alt='logo'
              className='h-[45px] w-[50px] lg:h-[70px] lg:w-[70px]'
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
                가천고
              </span>
            </div>
          </div>
          <input
            className='border-schoolmate-500 focus:border-schoolmate-500 h-[64px] w-[650px] rounded-[58px] border-[2px] px-7 text-2xl focus:outline-none focus:ring-0'
            type='text'
            placeholder='검색어를 입력해주세요.'
          />
        </div>
        <div className='h-[65px]'>
          {user?.profile ? (
            <></>
          ) : (
            <>
              <NextImage
                src='/images/profile.jpg'
                alt='profile'
                width={65}
                height={65}
                className='h-[65px] w-[65px] overflow-hidden rounded-full'
              />
            </>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
