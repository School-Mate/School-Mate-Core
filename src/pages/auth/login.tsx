import { AxiosError } from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import Router from 'next/router';
import { Session } from 'next-auth';
import {
  getCsrfToken,
  getSession,
  signIn,
  signOut,
  useSession,
} from 'next-auth/react';
import React, { useEffect, useState } from 'react';

import Toast, { updateToast } from '@/lib/toast';

import Button from '@/components/buttons/Button';
import Checkbox from '@/components/CheckBox';
import LoginLayout from '@/components/layout/LoginLayout';
import Logo from '@/components/Logo';
import Seo from '@/components/Seo';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { redirectTo } = ctx.query;
  const session = await getSession(ctx);
  const csrfToken = await getCsrfToken(ctx);

  return {
    props: {
      redirectTo: redirectTo || '/',
      session,
      csrfToken,
    },
  };
};

interface LoginProps {
  redirectTo: string;
  csrfToken: string;
  session: Session;
}

const Login: NextPage<LoginProps> = ({ redirectTo, session, csrfToken }) => {
  const { data: CSRsession, update: updateSession, status } = useSession();
  const [popup, setPopup] = useState<Window | null>();
  const [provider, setProvider] = useState<'kakao' | 'google'>();
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

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
          const Id = Toast('로그인 처리중...', 'loading');
          const res = await signIn('credentials', {
            provider,
            code,
            redirect: false,
          });
          if (!res?.ok) {
            updateToast(Id, '로그인중 오류가 발생했습니다', 'error');
          } else {
            const session = await updateSession();
            if (session?.user.registered) {
              updateToast(Id, '로그인 성공!', 'success');
              Router.push(redirectTo ? redirectTo : '/');
            } else {
              updateToast(Id, '회원가입을 진행해주세요!', 'success');
              Router.push('/auth/agreement');
            }
          }
        } catch (error) {
          console.log(error);

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
      await signOut({
        redirect: false,
      });
    } catch (error) {
      console.error(error);
    } finally {
      Router.push('/auth/agreement');
    }
  };

  const handleLogin = async () => {
    setLoginLoading(true);
    const Id = Toast('로그인 처리중...', 'loading');
    try {
      const res = await signIn('credentials', {
        phone: phone.replace(/-/g, ''),
        password,
        provider: 'id',
        redirect: false,
      });
      if (!res?.ok) {
        return updateToast(
          Id,
          '올바르지 않은 비밀번호 또는 전화번호입니다',
          'error'
        );
      }

      updateToast(Id, '로그인 성공!', 'success');
      if (redirectTo) {
        Router.push(redirectTo);
      } else {
        Router.push('/');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <>
      <Seo templateTitle='로그인' />
      <LoginLayout>
        <div className='mx-auto mt-auto w-full lg:w-[375px]'>
          <Logo className='mb-auto' />
          <div className='mt-10 flex flex-col lg:mt-10'>
            <span className='mb-1 text-sm lg:text-base'>전화번호</span>
            <input
              className='h-10 rounded-[10px] border-[2px] border-[#BABABA] px-3 focus:border-[#BABABA] focus:outline-none focus:ring-0 focus:ring-[#BABABA] lg:h-12'
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
            <span className='mb-1 text-sm lg:text-base'>비밀번호</span>
            <input
              className='h-10 rounded-[10px] border-[2px] border-[#BABABA] px-3 focus:border-[#BABABA] focus:outline-none focus:ring-0 focus:ring-[#BABABA] lg:h-12'
              type='password'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          <Button
            className='mt-8 flex h-10 w-full items-center justify-center rounded-[10px] lg:mt-10 lg:h-12'
            variant='primary'
            onClick={handleLogin}
          >
            로그인
          </Button>
        </div>
        <div className='mx-auto mb-auto mt-5 flex w-full flex-row items-center justify-between lg:w-[375px]'>
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
        <div className='mx-auto my-auto mt-5 w-full lg:mt-6 lg:w-[384px]'>
          <button
            className='flex h-10 w-full flex-row items-center justify-center rounded-[10px] bg-[#FEE500] lg:h-12 lg:w-[384px]'
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
            className='mt-4 flex h-10 w-full flex-row items-center justify-center rounded-[10px] border-2 border-[#BABABA] lg:h-12 lg:w-[384px]'
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
            <span className='mr-1 text-[10pt] lg:mr-2 lg:text-base'>
              아직 스쿨메이트 회원이 아니세요?
            </span>
            <button
              className='text-[10pt] underline underline-offset-2 lg:text-base'
              onClick={handleLogoutAndRegister}
            >
              회원가입하기
            </button>
          </div>
        </div>
      </LoginLayout>
    </>
  );
};

export default Login;
