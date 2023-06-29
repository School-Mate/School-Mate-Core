import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function Login() {
  const [popup, setPopup] = useState<Window | null>();

  const handleOpenPopup = (provider: 'kakao' | 'google') => {
    const width = 500;
    const height = 800;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      process.env.NEXT_PUBLIC_API_URL + `/auth/${provider}`,
      '로그인 중...',
      `width=${width},height=${height},left=${left},top=${top}`
    );
    setPopup(popup);
  };

  useEffect(() => {
    const currentUrl = window.location.href;
    const searchParams = new URL(currentUrl).searchParams;
    const code = searchParams.get('code');
    if (code) {
      window.opener.postMessage({ code }, window.location.origin);
    }
  }, []);

  // 로그인 팝입이 열리면 로그인 로직을 처리합니다.
  useEffect(() => {
    if (!popup) {
      return;
    }

    const OAuthCodeListener = (e: any) => {
      console.log(e);
      // 동일한 Origin 의 이벤트만 처리하도록 제한
      if (e.origin !== window.location.origin) {
        return;
      }
      const { code } = e.data;
      if (code) {
        // eslint-disable-next-line no-console
        console.log(`The popup URL has URL code param = ${code}`);
      }
      popup?.close();
      setPopup(null);
    };

    window.addEventListener('message', OAuthCodeListener, false);

    return () => {
      window.removeEventListener('message', OAuthCodeListener);
      popup?.close();
      setPopup(null);
    };
  }, [popup]);
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main className='flex h-[100vh] w-[100vw] items-center justify-center'>
        <div className='flex h-[90vh] w-[90vw] flex-col items-center rounded-[31px] bg-white lg:h-[909px] lg:w-[644px]'>
          <div className='w-full px-5 lg:w-[384px] lg:px-0'>
            <div className='mt-7 flex h-14 flex-row items-center justify-center lg:mt-20'>
              <Image
                src='/images/logo.png'
                alt='logo'
                width={100}
                height={100}
                objectFit='contain'
              />
            </div>
            <div className='mt-10 flex flex-col lg:mt-20'>
              <span className='mb-1 text-sm lg:text-lg'>전화번호</span>
              <input
                className='mt-1 h-10 rounded-[10px] border-[2px] border-[#BABABA] focus:border-[#BABABA] focus:outline-none focus:ring-0 focus:ring-[#BABABA] lg:h-[57px]'
                type='text'
              />
            </div>
            <div className='mt-2 flex flex-col lg:mt-4'>
              <span className='mb-1 text-sm lg:text-lg'>비밀번호</span>
              <input
                className='mt-1 h-10 rounded-[10px] border-[2px] border-[#BABABA] focus:border-[#BABABA] focus:outline-none focus:ring-0 focus:ring-[#BABABA] lg:h-[57px]'
                type='password'
              />
            </div>

            <Button
              className='mt-8 flex h-10 w-full items-center justify-center rounded-[10px] lg:mt-12 lg:h-[65px]'
              variant='primary'
            >
              로그인
            </Button>
          </div>
          <div className='mt-5 flex w-full flex-row items-center justify-between px-5 lg:w-[375px] lg:px-0'>
            <div className='flex flex-row items-center justify-center'>
              <input
                type='checkbox'
                className='h-[13px] w-[13px] border-[1px] border-[#BABABA] focus:border-[#BABABA] focus:outline-none focus:ring-0 focus:ring-[#BABABA] lg:h-[18px] lg:w-[18px]'
              />
              <span className='ml-2'>로그인 유지</span>
            </div>
            <Link href='/password' className='text-sm lg:text-base'>
              비밀번호 찾기{' '}
              <i className='fa-solid fa-chevron-right text-[10px] lg:text-sm' />
            </Link>
          </div>
          <div className='mb-10 mt-auto w-full px-5 lg:mt-6 lg:w-[384px] lg:px-0'>
            <button
              className='flex h-10 w-full flex-row items-center justify-center rounded-[10px] bg-[#F2CB05] lg:mt-20 lg:h-[65px] lg:w-[384px] lg:px-0'
              onClick={() => {
                handleOpenPopup('kakao');
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className='mr-1 h-[30px] w-[30px] lg:h-[36px] lg:w-[36px]'
                src='/images/kakao.png'
                alt='kakao'
              />
              <span>카카오로 시작하기</span>
            </button>
            <button
              className='mt-4 flex h-10 w-full flex-row items-center justify-center rounded-[10px] border-2 border-[#BABABA] lg:h-[65px] lg:w-[384px]'
              onClick={() => {
                handleOpenPopup('google');
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className='mr-2 h-[20px] w-[20px] lg:h-[26px] lg:w-[26px]'
                src='/images/google.png'
                alt='google'
              />
              <span>Google로 시작하기</span>
            </button>
            <div className='mt-4 flex flex-row items-center justify-center'>
              <span className='mr-1 text-sm lg:mr-2 lg:text-base'>
                아직 스쿨메이트 회원이 아니세요?
              </span>
              <Link
                href='/signup'
                className='text-sm underline underline-offset-2 lg:text-base'
              >
                회원가입하기
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
