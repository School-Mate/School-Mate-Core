import { AxiosError } from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import Router from 'next/router';
import * as React from 'react';

import client from '@/lib/client';
import clsxm from '@/lib/clsxm';
import useUser from '@/lib/hooks/useUser';
import Toast from '@/lib/toast';
import { passwordCheck as passCheck } from '@/lib/utils';

import Button from '@/components/buttons/Button';
import Input from '@/components/Input';
import Layout from '@/components/layout/Layout';
import LottieAnimaition from '@/components/LottieAnimaition';
import Seo from '@/components/Seo';

interface RegisterProps {
  marketing: boolean;
}

const Register: NextPage<RegisterProps> = ({ marketing }) => {
  const [messageSending, setMessageSending] = React.useState<boolean>(false);
  const [phoneVerifying, setPhoneVerifying] = React.useState<boolean>(false);
  const [phone, setPhone] = React.useState<string>('');
  const [phoneToken, setPhoneToken] = React.useState<string>('');
  const [password, setPassword] = React.useState('');
  const [passwordCheck, setPasswordCheck] = React.useState('');
  const [registeing, setRegisteing] = React.useState<boolean>(false);
  const [name, setName] = React.useState('');
  const [phoneVerified, setPhoneVerified] = React.useState<boolean>(false);
  const [phoneVerifyCode, setPhoneVerifyCode] = React.useState<string>('');
  const [step, setStep] = React.useState<number>(1);
  const phoneVerifyCodeRef = React.useRef<HTMLInputElement>(null);
  const { user, mutateUser, error: userError } = useUser();

  const handleSendPhoneToken = async () => {
    setMessageSending(true);

    try {
      const { data } = await client.post('/auth/verify/phonemessage', {
        phone: phone.replace(/-/g, ''),
      });
      setPhoneToken(data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        Toast(error.response?.data.message, 'error');
      } else {
        Toast('알 수 없는 오류가 발생했습니다.', 'error');
      }
    } finally {
      phoneVerifyCodeRef.current?.focus();
      setMessageSending(false);
    }
  };

  const handleVerifyPhoneToken = async () => {
    setPhoneVerifying(true);
    try {
      const { data } = await client.post('/auth/verify/phone', {
        phone: phone.replace(/-/g, ''),
        token: phoneToken,
        code: phoneVerifyCode,
      });
      setPhoneVerified(true);
      handleNextStep();
    } catch (error) {
      if (error instanceof AxiosError) {
        Toast(error.response?.data.message, 'error');
      } else {
        Toast('알 수 없는 오류가 발생했습니다.', 'error');
      }
    } finally {
      setPhoneVerifying(false);
    }
  };

  const handleRegister = async () => {
    if (!phoneVerified) {
      Toast('전화번호 인증이 진행되지 않았습니다.', 'error');
      return;
    }

    if (passCheck(password)) {
      return Toast(
        '최소 8자, 하나 이상의 문자, 숫자, 특수문자를 포함해주세요',
        'error'
      );
    }

    if (password !== passwordCheck) {
      Toast('비밀번호가 일치하지 않습니다.', 'error');
      return;
    }

    try {
      const { data } = await client.post('/auth/signup', {
        phone: phone.replace(/-/g, ''),
        password,
        name,
        provider: user
          ? user.provider === 'social'
            ? user.SocialLogin?.provider
            : 'id'
          : 'id',
        code: phoneVerifyCode,
        token: phoneToken,
        socialId: user ? user.SocialLogin?.socialId : null,
        marketingAgree: marketing,
      });

      await mutateUser();

      handleNextStep();
    } catch (error) {
      if (error instanceof AxiosError) {
        Toast(error.response?.data.message, 'error');
      } else {
        Toast('알 수 없는 오류가 발생했습니다.', 'error');
      }
    } finally {
      setRegisteing(false);
    }
  };

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const stepButtonList: {
    [key: number]: React.ReactNode;
  } = {
    1: (
      <Button
        className='mb-5 flex h-12 w-full items-center justify-center rounded-[10px] font-bold lg:mb-10 lg:h-[65px]'
        variant='primary'
        isLoading={phoneToken ? phoneVerifying : messageSending}
        onClick={phoneToken ? handleVerifyPhoneToken : handleSendPhoneToken}
      >
        {phoneToken ? '인증하기' : '인증번호 전송'}
      </Button>
    ),
    2: (
      <Button
        className='mb-5 flex h-12 w-full items-center justify-center rounded-[10px] font-bold lg:mb-10 lg:h-[65px]'
        variant='primary'
        isLoading={registeing}
        onClick={handleRegister}
      >
        회원가입
      </Button>
    ),
    3: (
      <div className='flex w-full flex-row space-x-5'>
        <Button
          className='mb-5 flex h-12 w-[40%] items-center justify-center rounded-[10px] font-bold lg:mb-10 lg:h-[65px]'
          variant='outline'
          onClick={() => {
            Router.push('/');
          }}
        >
          메인
        </Button>
        <Button
          className='mb-5 flex h-12 w-full items-center justify-center rounded-[10px] font-bold lg:mb-10 lg:h-[65px]'
          variant='primary'
          onClick={() => {
            Router.push('/auth/verify');
          }}
        >
          학교 인증하기
        </Button>
      </div>
    ),
  };

  const stepList: {
    [key: number]: React.ReactNode;
  } = {
    1: (
      <div className='mt-auto flex h-full w-full max-w-[551px] flex-col items-start justify-end px-5 lg:px-0'>
        <div className='mb-0 mt-6 flex flex-row items-center justify-center px-4 lg:mb-0 lg:mt-0'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src='/svg/Logo.svg'
            alt='logo'
            className='h-[60px] w-[60px] lg:h-[110px] lg:w-[110px]'
            style={{
              filter: 'drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.2))',
            }}
          />
          <span className='font ml-5 w-full text-xl font-bold lg:text-3xl'>
            본인인증
          </span>
        </div>
        <div className='mb-8 mt-8 h-[350px] w-full border-b border-t border-[#BABABA] pt-8 lg:mb-12 lg:max-h-[400px]'>
          <div className='flex flex-col'>
            <div className='mb-2 flex flex-row items-center'>
              <span className='text-sm font-bold lg:text-lg'>전화번호</span>
              <span className='ml-2 text-base font-bold text-[#BABABA] lg:text-lg'>
                (-를 제외한 번호 입력)
              </span>
            </div>
            <div className='flex flex-row'>
              <Input
                className='h-10 w-full rounded-[10px] border-[2px] border-[#BABABA] lg:h-[48px]'
                type='text'
                autoFocus
                value={phone}
                placeholder='전화번호를 입력해주세요'
                onChange={(e) => {
                  setPhone(
                    e.target.value
                      ?.replace(/[^0-9]/g, '')
                      .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
                      .replace(/(-{1,2})$/g, '')
                  );
                }}
              />
              <Button
                onClick={handleSendPhoneToken}
                className='ml-2 flex h-10 w-32 items-center justify-center rounded-[10px] font-bold lg:h-[48px]'
                variant='primary'
                isLoading={messageSending}
                disabled={phoneToken ? true : false}
              >
                {phoneToken ? '전송됨' : '전송'}
              </Button>
            </div>
          </div>
          <div className='mb-auto mt-4 flex flex-col'>
            <div className='mb-2 flex flex-row items-center'>
              <span className='text-sm font-bold lg:text-lg'>
                인증 번호 입력
              </span>
            </div>
            <div className='flex flex-row'>
              <Input
                ref={phoneVerifyCodeRef}
                disabled={phoneToken ? false : true}
                placeholder='인증번호를 입력해주세요'
                className='mr-2 h-10 w-full rounded-[10px] border-[2px] border-[#BABABA] lg:h-[48px]'
                type='text'
                onChange={(e) => {
                  setPhoneVerifyCode(e.target.value);
                }}
              />
              <div className='w-32' />
            </div>
          </div>
        </div>
        {stepButtonList[step]}
      </div>
    ),
    2: (
      <div className='mt-auto flex h-full w-full max-w-[551px] flex-col items-start justify-end px-5 lg:px-0'>
        <div className='mb-0 mt-6 flex flex-row items-center justify-center px-4 lg:mb-0 lg:mt-0'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src='/svg/Logo.svg'
            alt='logo'
            className='h-[60px] w-[60px] lg:h-[110px] lg:w-[110px]'
            style={{
              filter: 'drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.2))',
            }}
          />
          <span className='font ml-5 w-full text-xl font-bold lg:text-3xl'>
            회원가입
          </span>
        </div>
        <div className='mb-8 mt-8 h-[360px] w-full border-b border-t border-[#BABABA] pt-8 lg:mb-12 lg:max-h-[400px]'>
          <div className={clsxm('mb-6 flex flex-col')}>
            <div className='mb-1 flex flex-row items-center'>
              <span className='text-sm font-bold lg:text-lg'>이름</span>
            </div>
            <div className='flex flex-row'>
              <Input
                className='h-10 w-full rounded-[10px] border-[2px] border-[#BABABA] lg:h-[48px]'
                type='name'
                autoFocus
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder='이름을 입력해주세요'
              />
            </div>
          </div>
          <div
            className={clsxm(
              'flex flex-col',
              !userError ? 'hidden' : 'mb-6 block'
            )}
          >
            <div className='mb-1 flex flex-row items-center'>
              <span className='text-sm font-bold lg:text-lg'>비밀번호</span>
            </div>
            <div className='relative flex flex-row'>
              <Input
                className='h-10 w-full rounded-[10px] border-[2px] border-[#BABABA] lg:h-[48px]'
                type='password'
                value={password}
                placeholder='비밀번호를 입력해주세요'
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              {!passCheck(password) && (
                <span className='absolute bottom-[-22px] left-0 text-sm text-red-500'>
                  8자 이상, 한개의 문자, 숫자, 특수문자를 포함해주세요
                </span>
              )}
            </div>
          </div>
          <div
            className={clsxm(
              'flex flex-col',
              !userError ? 'hidden' : 'mb-6 block'
            )}
          >
            <div className='mb-1 flex flex-row items-center'>
              <span className='text-sm font-bold lg:text-lg'>
                비밀번호 확인
              </span>
            </div>
            <div className='relative flex flex-row'>
              <Input
                className='h-10 w-full rounded-[10px] border-[2px] border-[#BABABA] lg:h-[48px]'
                type='password'
                placeholder='비밀번호를 입력해주세요'
                value={passwordCheck}
                onChange={(e) => {
                  setPasswordCheck(e.target.value);
                }}
              />
              {password != passwordCheck && (
                <span className='absolute bottom-[-22px] left-0 text-sm text-red-500'>
                  비밀번호와 비밀번호 확인이 일치하지 않습니다.
                </span>
              )}
            </div>
          </div>
        </div>
        {stepButtonList[step]}
      </div>
    ),
    3: (
      <div className='mt-auto flex h-full w-full max-w-[551px] flex-col items-start justify-end px-5 lg:px-0'>
        <div className='mb-0 mt-6 flex flex-row items-center justify-center px-4 lg:mb-0 lg:mt-0'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src='/svg/Logo.svg'
            alt='logo'
            className='h-[60px] w-[60px] lg:h-[110px] lg:w-[110px]'
            style={{
              filter: 'drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.2))',
            }}
          />
          <span className='font ml-5 w-full text-xl font-bold lg:text-3xl'>
            완료되었습니다!
          </span>
        </div>
        <div className='mb-8 mt-8 flex h-[350px] w-full items-center justify-center border-t border-[#BABABA] pt-8 lg:mb-12 lg:max-h-[400px]'>
          <LottieAnimaition
            className='h-40 w-40'
            loop={false}
            animation={require('../../lottieFiles/success.json')}
          />
        </div>
        {stepButtonList[step]}
      </div>
    ),
  };

  return (
    <Layout>
      <Seo templateTitle='회원가입' />
      <main className='background flex min-h-[100vh] w-[100vw] items-center justify-center'>
        <div className='my-10 flex min-h-[90vh] w-[90vw] flex-col items-center rounded-[31px] bg-white lg:max-h-[909px] lg:max-w-[644px]'>
          {stepList[step]}
        </div>
      </main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { marketing } = ctx.query;

  return {
    props: {
      marketing: marketing === 'N' ? false : true,
    },
  };
};

export default Register;
