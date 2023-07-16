import { useState } from 'react';

import client from '@/lib/client';
import Toast from '@/lib/toast';
import { passwordCheck } from '@/lib/utils';

import Button from '@/components/buttons/Button';
import Input from '@/components/Input';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

const PasswordChange = () => {
  const [nowPassword, setNowPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);

  const changePssword = async () => {
    if (newPassword !== newPasswordCheck) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    if (passwordCheck(newPassword)) {
      return Toast(
        '최소 8자, 하나 이상의 문자, 숫자, 특수문자를 포함해주세요',
        'error'
      );
    }

    setPasswordChangeLoading(true);

    try {
      await client.post('/auth/changepass', {
        password: nowPassword,
        newPassword: newPassword,
      });
      Toast('비밀번호가 변경되었습니다.', 'success');
    } catch (e) {
      Toast('비밀번호 변경에 실패하였습니다.', 'error');
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  return (
    <Layout>
      <Seo templateTitle='비밀번호 변경' />

      <main className='background flex h-full min-h-[100vh] w-full min-w-[100vw] items-center justify-center'>
        <div className='my-10 flex min-h-[90vh] w-[90vw] flex-col items-center rounded-[31px] bg-white lg:max-h-[909px] lg:max-w-[644px]'>
          <div className='mt-auto w-full max-w-[551px] px-5 lg:px-0'>
            <div className='mt-7 flex flex-row items-center justify-center px-4'>
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
                비밀번호 변경
              </span>
            </div>
            <div className='mb-8 mt-8 h-[400px] w-full border-t border-[#BABABA] pt-8 lg:mb-12 lg:max-h-[400px]'>
              <div className='flex h-full flex-col'>
                <div className='flex flex-row items-center justify-between'>
                  <div className='flex flex-row'>
                    <span className='text-xl font-bold'>현재 비밀번호</span>
                  </div>
                  <div className='relative w-80'>
                    <Input
                      type='password'
                      placeholder='현재 비밀번호를 입력해주세요.'
                      className='h-[54px] w-full rounded-[10px] text-lg'
                      onChange={(e) => {
                        setNowPassword(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className='mt-7 flex flex-row items-center justify-between'>
                  <div className='flex flex-row'>
                    <span className='text-xl font-bold'>새 비밀번호</span>
                  </div>
                  <div className='relative w-80'>
                    <Input
                      type='password'
                      placeholder='새 비밀번호를 입력해주세요.'
                      className='h-[54px] w-full rounded-[10px] text-lg'
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                      }}
                    />
                    {!passwordCheck(newPassword) && (
                      <span className='absolute bottom-[-22px] left-0 text-sm text-red-500'>
                        8자 이상, 한개의 문자, 숫자, 특수문자를 포함해주세요
                      </span>
                    )}
                  </div>
                </div>
                <div className='mt-7 flex flex-row items-center justify-between'>
                  <div className='flex flex-row'>
                    <span className='text-xl font-bold'>새 비밀번호 확인</span>
                  </div>
                  <div className='relative w-80'>
                    <Input
                      type='password'
                      placeholder='비밀번호를 한번 더 입력해주세요.'
                      className='h-[54px] w-full rounded-[10px] text-lg'
                      onChange={(e) => {
                        setNewPasswordCheck(e.target.value);
                      }}
                    />
                    {newPassword != newPasswordCheck && (
                      <span className='absolute bottom-[-22px] left-0 text-sm text-red-500'>
                        비밀번호와 비밀번호 확인이 일치하지 않습니다.
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  className='mt-auto flex h-14 w-full items-center justify-center rounded-[10px] text-xl font-bold text-white'
                  type='button'
                  onClick={changePssword}
                  isLoading={passwordChangeLoading}
                >
                  완료
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default PasswordChange;
