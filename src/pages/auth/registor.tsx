import { AxiosError } from 'axios';
import * as React from 'react';

import client from '@/lib/client';
import useUser from '@/lib/hooks/useUser';
import Toast from '@/lib/toast';

import Button from '@/components/buttons/Button';
import Input from '@/components/Input';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

const Registor = () => {
  const [messageSending, setMessageSending] = React.useState<boolean>(false);
  const [phoneVerifying, setPhoneVerifying] = React.useState<boolean>(false);
  const [phone, setPhone] = React.useState<string>('');
  const [phoneToken, setPhoneToken] = React.useState<string>('');
  const [phoneVerified, setPhoneVerified] = React.useState<boolean>(false);
  const [phoneVerifyCode, setPhoneVerifyCode] = React.useState<string>('');
  const [step, setStep] = React.useState<number>(1);
  const phoneVerifyCodeRef = React.useRef<HTMLInputElement>(null);
  const { user, mutateUser } = useUser();

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

  const handleRegistor = async () => {
    return;
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
        onClick={handleRegistor}
      >
        다음
      </Button>
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
        <div className='mb-8 mt-8 h-full max-h-[350px] w-full border-b border-t border-[#BABABA] pt-8 lg:mb-12 lg:max-h-[400px]'>
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
                value={phone}
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
        <div className='mb-8 mt-8 h-full max-h-[350px] w-full border-b border-t border-[#BABABA] pt-8 lg:mb-12 lg:max-h-[400px]'>
          <div className='flex flex-col'>
            <div className='mb-2 flex flex-row items-center'>
              <span className='text-sm font-bold lg:text-lg'>아이디</span>
              <span className='ml-2 text-base font-bold text-[#BABABA] lg:text-lg'>
                (-를 제외한 번호 입력)
              </span>
            </div>
            <div className='flex flex-row'>
              <Input
                className='h-10 w-full rounded-[10px] border-[2px] border-[#BABABA] lg:h-[48px]'
                type='text'
                value={phone}
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
  };

  return (
    <Layout>
      <Seo templateTitle='회원가입' />

      <main className='flex h-[100vh] w-[100vw] items-center justify-center'>
        <div className='flex h-[90vh] w-[90vw] flex-col items-center rounded-[31px] bg-white lg:max-h-[909px] lg:max-w-[644px]'>
          {stepList[step]}
        </div>
      </main>
    </Layout>
  );
};

export default Registor;
