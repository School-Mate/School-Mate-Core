import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import client from '@/lib/client';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function Login() {
  const [popup, setPopup] = useState<Window | null>();
  const [provider, setProvider] = useState<'kakao' | 'google'>();

  const handleOpenPopup = (provider: 'kakao' | 'google') => {
    setProvider(provider);
    const width = 500;
    const height = 800;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI}&response_type=code`;
    const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI}&response_type=code&scope=email%20profile`;

    const popup = window.open(
      provider === 'kakao'
        ? kakaoLoginUrl
        : provider === 'google'
        ? googleLoginUrl
        : '',
      '로그인 중...',
      `width=${width},height=${height},left=${left},top=${top}`
    );
    setPopup(popup);
  };

  useEffect(() => {
    if (!popup) {
      return;
    }

    const timer = setInterval(async () => {
      if (!popup) {
        timer && clearInterval(timer);
        return;
      }
      const currentUrl = popup.location.href;
      if (!currentUrl) {
        return;
      }
      const searchParams = new URL(currentUrl).searchParams;
      const code = searchParams.get('code');
      if (code) {
        popup.close();
        timer && clearInterval(timer);
        try {
          await client.get(`/auth/${provider}/callback?code=${code}`);
        } catch (error) {
          return;
        }
      }
    }, 500);

    return () => {
      timer && clearInterval(timer);
    };
  }, [popup, provider]);

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main className='flex h-[100vh] w-[100vw] items-center justify-center'>
        <div className='flex h-[90vh] w-[90vw] flex-col items-center rounded-[31px] bg-white lg:max-h-[909px] lg:max-w-[644px]'>
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
          <div className='mb-auto mt-5 flex w-full flex-row items-center justify-between px-5 lg:w-[375px] lg:px-0'>
            <div className='flex flex-row items-center justify-center'>
              <input
                id='remember-me'
                type='checkbox'
                className='accent-schoolmate-500 checked:bg-schoolmate-500 h-[13px] w-[13px] rounded-[2px] border-[2px] border-[#BABABA] checked:border-transparent focus:border-[#BABABA] focus:outline-none focus:ring-0 focus:ring-[#BABABA] lg:h-[18px] lg:w-[18px]'
              />
              <label htmlFor='remember-me' className='ml-2'>
                로그인 유지
              </label>
            </div>
            <Link href='/password' className='text-sm lg:text-base'>
              비밀번호 찾기{' '}
              <i className='fa-solid fa-chevron-right text-[10px] lg:text-sm' />
            </Link>
          </div>
          <div className='mb-10 mt-auto w-full px-5 lg:mt-6 lg:w-[384px] lg:px-0'>
            <button
              className='flex h-10 w-full flex-row items-center justify-center rounded-[10px] bg-[#F2CB05] lg:h-[65px] lg:w-[384px] lg:px-0'
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
