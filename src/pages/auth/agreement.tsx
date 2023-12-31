import Router from 'next/router';
import { useState } from 'react';

import Toast from '@/lib/toast';

import Button from '@/components/buttons/Button';
import Checkbox from '@/components/CheckBox';
import LoginLayout from '@/components/layout/LoginLayout';
import Seo from '@/components/Seo';

const LoginAgreement = () => {
  const [agreementAge, setAgreementAge] = useState<boolean>(false);
  const [agreementTos, setAgreementTos] = useState<boolean>(false);
  const [agreementPrivacy, setAgreementPrivacy] = useState<boolean>(false);
  const [agreementAds, setAgreementAds] = useState<boolean>(false);

  const handleAgreementAll = () => {
    if (!agreementAge) {
      setAgreementAge(true);
    }

    if (!agreementTos) {
      setAgreementTos(true);
    }

    if (!agreementPrivacy) {
      setAgreementPrivacy(true);
    }

    if (!agreementAds) {
      setAgreementAds(true);
    }

    if (agreementAge && agreementTos && agreementPrivacy && agreementAds) {
      setAgreementAge(false);
      setAgreementTos(false);
      setAgreementPrivacy(false);
      setAgreementAds(false);
    }
  };

  const nextButton = (type: 'agreemanet' | 'next') => {
    if (type === 'agreemanet') {
      handleAgreementAll();
    } else if (type === 'next') {
      if (!agreementAge || !agreementTos || !agreementPrivacy)
        return Toast('필수 약관에 동의해주세요.', 'error');
      Router.push(`/auth/register?marketing=${agreementAds ? 'Y' : 'N'}`);
    }
  };

  return (
    <>
      <Seo templateTitle='약관동의' />
      <LoginLayout>
        <div className='mb-auto flex flex-row items-center justify-center px-5 pt-20'>
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
            약관동의
          </span>
        </div>
        <div className='mt-auto flex flex-col'>
          <hr className='my-8 border-[#BABABA]' />
          <div className='flex w-full flex-row items-center px-3'>
            <label
              className='flex flex-row text-base lg:text-lg'
              htmlFor='agreement-age'
            >
              <span className='font-bold'>필수</span>
              <span className='ml-4'>만 12세 이상입니다</span>
            </label>
            <Checkbox
              id='agreement-age'
              className='ml-auto h-4 w-4 lg:h-[24px] lg:w-[24px]'
              onChange={() => setAgreementAge(!agreementAge)}
              checked={agreementAge}
            />
          </div>
          <div className='mt-5 flex w-full flex-row items-center px-3'>
            <label
              className='flex flex-row text-base lg:text-lg'
              htmlFor='agreement-tos'
            >
              <span className='font-bold'>필수</span>
              <span className='ml-4 flex flex-row items-center justify-center'>
                스쿨메이트 이용 약관
                <i className='fa-solid fa-chevron-right ml-2 text-[10px] lg:text-sm' />
              </span>
            </label>
            <Checkbox
              id='agreement-tos'
              className='ml-auto h-4 w-4 lg:h-[24px] lg:w-[24px]'
              onChange={() => setAgreementTos(!agreementTos)}
              checked={agreementTos}
            />
          </div>
          <div className='mt-5 flex w-full flex-row items-center px-3'>
            <label
              className='flex flex-row text-base lg:text-lg'
              htmlFor='agreement-privacy'
            >
              <span className='font-bold'>필수</span>
              <span className='ml-4 flex flex-row items-center justify-center'>
                개인정보 수집 및 이용 동의
                <i className='fa-solid fa-chevron-right ml-2 text-[10px] lg:text-sm' />
              </span>
            </label>
            <Checkbox
              id='agreement-privacy'
              className='ml-auto h-4 w-4 lg:h-[24px] lg:w-[24px]'
              onChange={() => setAgreementPrivacy(!agreementPrivacy)}
              checked={agreementPrivacy}
            />
          </div>
          <div className='mt-5 flex w-full flex-row items-center px-3'>
            <label
              className='flex flex-row text-base lg:text-lg'
              htmlFor='agreement-ads'
            >
              <span className='font-bold'>선택</span>
              <span className='ml-4 flex flex-row items-center justify-center'>
                광고성 정보 수신 동의
                <i className='fa-solid fa-chevron-right ml-2 text-[10px] lg:text-sm' />
              </span>
            </label>
            <Checkbox
              id='agreement-ads'
              className='ml-auto h-4 w-4 lg:h-[24px] lg:w-[24px]'
              onChange={() => setAgreementAds(!agreementAds)}
              checked={agreementAds}
            />
          </div>
          <hr className='my-8 border-[#BABABA]' />
          <div className='ml-auto flex items-center px-3 text-base lg:text-lg'>
            <label htmlFor='agreement-all'>전체동의</label>
            <Checkbox
              onChange={() => {
                handleAgreementAll();
              }}
              id='agreement-all'
              checked={
                agreementAge && agreementTos && agreementPrivacy && agreementAds
              }
              className='ml-3 h-4 w-4 lg:h-[24px] lg:w-[24px]'
            />
          </div>
        </div>
        <div className='mb-4 mt-10 flex flex-row space-x-2 lg:space-x-9'>
          <Button
            className='mb-5 flex h-10 w-full items-center justify-center rounded-[10px] font-bold lg:h-[65px]'
            variant='outline'
            onClick={() => {
              Router.back();
            }}
          >
            취소
          </Button>
          <Button
            className='mb-5 flex h-10 w-full items-center justify-center rounded-[10px] font-bold lg:h-[65px]'
            variant='primary'
            onClick={() => {
              nextButton(
                !agreementAge &&
                  !agreementTos &&
                  !agreementPrivacy &&
                  !agreementAds
                  ? 'agreemanet'
                  : 'next'
              );
            }}
          >
            {!agreementAge &&
            !agreementTos &&
            !agreementPrivacy &&
            !agreementAds
              ? '전체동의'
              : '다음'}
          </Button>
        </div>
      </LoginLayout>
    </>
  );
};

export default LoginAgreement;
