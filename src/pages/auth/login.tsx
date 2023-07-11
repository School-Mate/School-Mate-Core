import { AxiosError } from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';

import client from '@/lib/client';
import useUser from '@/lib/hooks/useUser';
import Toast from '@/lib/toast';

import Button from '@/components/buttons/Button';
import Checkbox from '@/components/CheckBox';
import Layout from '@/components/layout/Layout';
import Logo from '@/components/Logo';
import Seo from '@/components/Seo';

import { Response } from '@/types/client';
import { User } from '@/types/user';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { redirectTo } = ctx.query;

  return {
    props: {
      redirectTo: redirectTo || '/',
    },
  };
};

interface LoginProps {
  redirectTo: string;
}

const Login: NextPage<LoginProps> = ({ redirectTo }) => {
  const [popup, setPopup] = useState<Window | null>();
  const [provider, setProvider] = useState<'kakao' | 'google'>();
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const { mutateUser } = useUser();

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
          const { data } = await client.get<Response<User>>(
            `/auth/${provider}/callback?code=${code}`
          );

          await mutateUser();

          if (!data.data.verified) {
            return Router.push('/auth/agreement');
          } else {
            return Router.push(redirectTo);
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            return Toast(error.response?.data?.message, 'error');
          }
        }
      }
    }, 500);

    return () => {
      timer && clearInterval(timer);
    };
  }, [popup, provider]);

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

  const handleLogoutAndRegister = async () => {
    try {
      await client.get('/auth/logout');
      await mutateUser();
    } catch (error) {
      console.error(error);
    } finally {
      Router.push('/auth/agreement');
    }
  };

  const handleLogin = async () => {
    setLoginLoading(true);

    try {
      const { data } = await client.post<Response<User>>('/auth/login', {
        phone: phone.replace(/-/g, ''),
        password,
      });
      await mutateUser();
      Router.push(redirectTo);
    } catch (error) {
      if (error instanceof AxiosError) {
        Toast(error.response?.data?.message, 'error');
        return;
      } else {
        Toast('알 수 없는 오류가 발생했습니다.', 'error');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <Layout>
      <Seo templateTitle='로그인' />

      <main className='background flex h-full min-h-[100vh] w-full min-w-[100vw] items-center justify-center'>
        <div className='my-8 flex min-h-[85vh] w-[90vw] flex-col items-center justify-center rounded-[31px] bg-white py-10 lg:max-h-[909px] lg:min-h-[75vh] lg:max-w-[644px]'>
          <div className='w-full px-5 lg:w-[384px] lg:px-0'>
            <Logo className='mt-7' />
            <div className='mt-10 flex flex-col lg:mt-10'>
              <span className='mb-1 text-sm lg:text-lg'>전화번호</span>
              <input
                className='mt-1 h-10 rounded-[10px] border-[2px] border-[#BABABA] px-3 focus:border-[#BABABA] focus:outline-none focus:ring-0 focus:ring-[#BABABA] lg:h-[57px]'
                type='text'
                value={phone}
                placeholder='010-1234-0000'
                onChange={(e) => {
                  setPhone(
                    e.target.value
                      ?.replace(/[^0-9]/g, '')
                      .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
                      .replace(/(-{1,2})$/g, '')
                  );
                }}
              />
            </div>
            <div className='mt-2 flex flex-col lg:mt-4'>
              <span className='mb-1 text-sm lg:text-lg'>비밀번호</span>
              <input
                className='mt-1 h-10 rounded-[10px] border-[2px] border-[#BABABA] px-3 focus:border-[#BABABA] focus:outline-none focus:ring-0 focus:ring-[#BABABA] lg:h-[57px]'
                type='password'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>

            <Button
              className='mt-8 flex h-10 w-full items-center justify-center rounded-[10px] lg:mt-12 lg:h-[65px]'
              variant='primary'
              onClick={handleLogin}
            >
              로그인
            </Button>
          </div>
          <div className='mb-20 mt-5 flex w-full flex-row items-center justify-between px-5 lg:w-[375px] lg:px-0'>
            <div className='flex flex-row items-center justify-center'>
              <Checkbox
                id='remember-me'
                className='h-[13px] w-[13px] rounded-[2px] border-[2px] lg:h-[18px] lg:w-[18px]'
              />
              <label htmlFor='remember-me' className='ml-2'>
                로그인 유지
              </label>
            </div>
            <Link href='/password' className='text-sm lg:text-base'>
              비밀번호 찾기
              <i className='fa-solid fa-chevron-right ml-1 text-[10px] lg:text-sm' />
            </Link>
          </div>
          <div className='mt-5 w-full px-5 lg:mt-6 lg:w-[384px] lg:px-0'>
            <button
              className='flex h-10 w-full flex-row items-center justify-center rounded-[10px] bg-[#FEE500] lg:h-[65px] lg:w-[384px] lg:px-0'
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
              <button
                className='text-sm underline underline-offset-2 lg:text-base'
                onClick={handleLogoutAndRegister}
              >
                회원가입하기
              </button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Login;
