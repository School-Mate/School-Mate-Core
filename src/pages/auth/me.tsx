import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import Router from 'next/router';
import { useEffect, useRef, useState } from 'react';

import client from '@/lib/client';
import clsxm from '@/lib/clsxm';
import useSchool from '@/lib/hooks/useSchool';
import useUser from '@/lib/hooks/useUser';
import Toast from '@/lib/toast';

import Button from '@/components/buttons/Button';
import Error from '@/components/Error';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { LoadingScreen } from '@/components/Loading';
import Login from '@/components/Login';
import Modal from '@/components/Modal';
import Seo from '@/components/Seo';
import Tooltips from '@/components/Tooltips';

import { Response } from '@/types/client';
import { User } from '@/types/user';

interface MyPageProps {
  user: User;
}

const MyPage: NextPage<MyPageProps> = ({ user: userDataServerSide }) => {
  const { user, mutateUser: reloadUser, error } = useUser();
  const { school, isLoading: schoolLoading, error: schoolError } = useSchool();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  useEffect(() => {
    reloadUser(userDataServerSide, false);
  }, []);

  const logout = async () => {
    try {
      await client.get<Response<null>>(`/auth/logout`);
      Router.push('/');
    } catch (e) {
      Toast('로그아웃에 실패했습니다', 'error');
    }
  };

  const updateProfile = async (file?: File) => {
    if (!file) {
      setImageUploading(true);
      try {
        await client.patch<Response<User>>(`/auth/me/profile`, {
          imageId: null,
        });

        await reloadUser();

        Toast('프로필 사진을 삭제했습니다', 'success');
      } catch (e) {
        return Toast('프로필 사진 삭제에 실패했습니다', 'error');
      } finally {
        setImageUploading(false);

        if (imageInputRef.current) {
          imageInputRef.current.value = '';
        }
      }
      return;
    }
    const { size } = file;

    if (size > 1024 * 1024 * 5) {
      return Toast('이미지는 5MB 이하만 업로드 가능합니다', 'error');
    }
    setImageUploading(true);

    const formData = new FormData();
    formData.append('img', file);

    let imageId = '';
    try {
      const { data } = await client.post<Response<string>>(`/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          storage: 'profile',
        },
      });

      imageId = data.data;
    } catch (e) {
      setImageUploading(false);
      return Toast('이미지 업로드에 실패했습니다', 'error');
    }

    try {
      await client.patch<Response<User>>(`/auth/me/profile`, {
        imageId: imageId,
      });

      await reloadUser();

      Toast('프로필 사진을 변경했습니다', 'success');
    } catch (e) {
      await client.delete(`/image/${imageId}`);
      return Toast('프로필 사진 변경에 실패했습니다', 'error');
    } finally {
      setImageUploading(false);

      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  };

  if (schoolError || error) return <Login redirectTo='/auth/me' />;
  if (schoolLoading && !school) return <LoadingScreen />;
  if (!user) return <LoadingScreen />;
  if (imageUploading) return <LoadingScreen />;
  if (!school) return <Error message='학교 정보를 찾을 수 없습니다' />;

  return (
    <>
      <Seo templateTitle='내 정보' />
      <DashboardLayout user={user} school={school}>
        <div className='mx-auto flex min-h-[80vh] w-full max-w-[600px] flex-col'>
          <div className='flex w-full flex-col rounded-[20px] border-2 border-[#E3E5E8] p-5'>
            <span className='text-xl font-bold'>내 정보</span>
            <div className='mt-2 flex flex-row items-center'>
              <div className='flex w-20 flex-col'>
                <div
                  className='relative h-20 w-20 rounded-[20px] border border-[#D8D8D8]'
                  style={{
                    backgroundImage: user.profile
                      ? `url(${
                          process.env.NEXT_PUBLIC_S3_URL + '/' + user.profile
                        })`
                      : `url(/svg/CloverGray.svg)`,
                    backgroundColor: '#F1F1F1',
                    backgroundSize: user.profile ? 'cover' : '50px 50px',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                >
                  <button
                    onClick={() => {
                      updateProfile();
                    }}
                    className='absolute -right-1 -top-1 flex h-[19px] w-[19px] items-center justify-center rounded-[20px] bg-[#636363]'
                  >
                    <i className='fas fa-times mx-auto my-auto text-sm text-white' />
                  </button>
                </div>
                <button
                  className='mt-2 w-full rounded-[5px] border py-1 text-sm text-[#989898] hover:bg-gray-100'
                  onClick={() => {
                    imageInputRef.current?.click();
                  }}
                >
                  업로드
                </button>
                <input
                  ref={imageInputRef}
                  type='file'
                  className='hidden'
                  accept='image/*'
                  maxLength={1}
                  onChange={(e) => {
                    if (e.target.files?.length === 0 || !e.target.files) return;
                    updateProfile(e.target.files[0]);
                  }}
                />
              </div>
              <div className='ml-5 flex w-full flex-col'>
                <div className='flex w-full flex-row items-center border-b pb-2'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src='/svg/User.svg' alt='user' className='h-6 w-6' />
                  <span className='ml-2 text-[#989898]'>{user.name}</span>
                  <button
                    className='ml-auto h-7 w-16 rounded-[5px] border border-[#D8D8D8] bg-[#F9F9F9] text-[#9A9A9A] hover:text-[#636363]'
                    // onClick={() => {
                    //   window.location.href = '/auth/me/edit/name';
                    // }}
                  >
                    수정
                  </button>
                </div>
                <div className='mt-2 flex w-full flex-row items-center border-b pb-2'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src='/svg/Phone.svg' alt='user' className='h-6 w-6' />
                  <span className='ml-2 font-light text-[#989898]'>
                    {user.phone?.slice(0, 3) +
                      '-' +
                      user.phone?.slice(3, 4) +
                      '***-' +
                      user.phone?.slice(7, 8) +
                      '***'}
                  </span>
                  <button
                    className='ml-auto h-7 w-16 rounded-[5px] border border-[#D8D8D8] bg-[#F9F9F9] text-[#9A9A9A] hover:text-[#636363]'
                    // onClick={() => {
                    //   window.location.href = '/auth/me/edit/name';
                    // }}
                  >
                    수정
                  </button>
                </div>
                <div className='mt-2 flex w-full flex-row items-center'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src='/svg/Home.svg' alt='user' className='h-6 w-6' />
                  <span className='ml-2 text-[#989898]'>
                    {school.school.defaultName + ' ' + school.grade + '학년'}
                  </span>
                  <Tooltips
                    tooltip={
                      <div className='ml-auto w-60 text-sm'>
                        학교 변경은{' '}
                        <span className='text-schoolmate-500 font-bold underline'>
                          학교인증
                        </span>{' '}
                        창으로 이동해주세요
                      </div>
                    }
                  >
                    <div
                      className={clsxm(
                        '-mt-2 ml-0.5 flex items-center justify-center'
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src='/svg/Info.svg'
                        className='h-4 w-4'
                        style={{
                          filter:
                            'invert(66%) sepia(8%) saturate(10%) hue-rotate(353deg) brightness(91%) contrast(88%)',
                        }}
                        alt='info'
                      />
                    </div>
                  </Tooltips>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-5 flex w-full flex-col rounded-[20px] border-2 border-[#E3E5E8] p-5'>
            <span className='text-xl font-bold'>계정</span>
            <div className='mt-5 flex w-full flex-col items-start space-y-5 text-lg'>
              <Link className='w-full' href='/auth/verify'>
                학교인증
              </Link>
              {user.provider === 'id' ? (
                <Link className='w-full' href='/auth/changepass'>
                  비밀번호 변경
                </Link>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className='mt-5 flex w-full flex-col rounded-[20px] border-2 border-[#E3E5E8] p-5'>
            <span className='text-xl font-bold'>이용안내</span>
            <div className='mt-5 flex w-full flex-col items-start space-y-5 text-lg'>
              <Link className='w-full' href='/privacy'>
                이용 규칙/개인정보 처리방침
              </Link>
              <Link className='w-full' href='/qna'>
                문의하기
              </Link>
              <Link className='w-full' href='/qna'>
                탈퇴
              </Link>
            </div>
          </div>

          <Button
            onClick={() => {
              setLogoutModal(true);
            }}
            className='hover:bg-schoolmate-500 mt-5 flex h-[60px] w-full items-center justify-center rounded-[10px] border border-[#D8D8D8] font-bold text-[#939393] hover:text-white'
            variant='outline'
          >
            로그아웃
          </Button>
        </div>
      </DashboardLayout>

      <Modal
        isOpen={logoutModal}
        callbackOpen={(open) => {
          setLogoutModal(open);
        }}
        className='w-[500px]'
      >
        <div className='flex flex-col items-center justify-center py-2'>
          <span className='mb-5 text-xl font-bold'>로그아웃 하시겠습니까?</span>
          <div className='mt-2 flex h-12 w-full flex-row space-x-9'>
            <button
              onClick={() => {
                setLogoutModal(false);
              }}
              className='flex w-full items-center justify-center rounded-[10px] border border-[#D8D8D8] bg-[#D9D9D9] font-bold text-white'
            >
              취소
            </button>
            <Button
              className='flex w-full items-center justify-center rounded-[10px] font-bold'
              variant='primary'
              onClick={() => {
                logout();
              }}
            >
              로그아웃
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    req: { cookies },
  } = ctx;

  if (!cookies.Authorization) {
    return {
      redirect: {
        destination: '/auth/login?redirectTo=/auth/me',
        permanent: false,
      },
    };
  }

  try {
    const { data: myData } = await client.get<Response<User>>(`/auth/me`, {
      headers: {
        Authorization: 'Bearer ' + cookies.Authorization,
      },
    });

    if (!myData.data.verified) {
      return {
        redirect: {
          destination: '/auth/agreement',
          permanent: false,
        },
      };
    }

    return {
      props: {
        user: myData.data,
      },
    };
  } catch (e) {
    return {
      redirect: {
        destination: '/auth/login?redirectTo=/auth/me',
        permanent: false,
      },
    };
  }
};

export default MyPage;
