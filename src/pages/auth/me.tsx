import { AxiosError } from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import Router from 'next/router';
import { Session } from 'next-auth';
import { getSession, signOut, useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import { useDetectClickOutside } from 'react-detect-click-outside';
import useSWR from 'swr';

import client from '@/lib/client';
import clsxm from '@/lib/clsxm';
import Toast from '@/lib/toast';

import Button from '@/components/buttons/Button';
import Error from '@/components/Error';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { LoadingScreen } from '@/components/Loading';
import Modal from '@/components/Modal';
import Profile from '@/components/Profile';
import Seo from '@/components/Seo';
import Tooltips from '@/components/Tooltips';

import { AskedQuestionWithMe } from '@/types/asked';
import { Response } from '@/types/client';
import { User } from '@/types/user';

interface MyPageProps {
  session: Session;
}

const MyPage: NextPage<MyPageProps> = ({ session }) => {
  const { update, data: CSRsession } = useSession();
  const {
    data: askedUser,
    isLoading: loadingAsked,
    mutate: reloadAsked,
  } = useSWR<AskedQuestionWithMe>('/auth/me/asked');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [openEditUserNickname, setOpenEditUserNickname] = useState(false);
  const [editUserNickname, setEditUserNickname] = useState<string>();
  const [editUserNicknameLoading, setEditUserNicknameLoading] = useState(false);
  const [openEditUserCustomId, setOpenEditUserCustomId] = useState(false);
  const [editUserCustomIdLoading, setEditUserCustomIdLoading] = useState(false);
  const [editUserCustomId, setEditUserCustomId] = useState<string>();
  const refIdInput = useDetectClickOutside({
    onTriggered: () => {
      setOpenEditUserCustomId(false);
      setEditUserCustomId(undefined);
    },
  });
  const refNicknameInput = useDetectClickOutside({
    onTriggered: () => {
      setOpenEditUserNickname(false);
      setEditUserNickname(undefined);
    },
  });

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      Router.push('/');
    } catch (e) {
      Toast('로그아웃에 실패했습니다', 'error');
    }
  };

  const updateUserId = async () => {
    if (!editUserCustomId) {
      return Toast('사용할 커스텀 아이디를 입력해주세요', 'error');
    }

    if (!/^[a-zA-Z0-9]*$/.test(editUserCustomId)) {
      return Toast('커스텀 아이디는 영어와 숫자만 가능합니다', 'error');
    }

    if (editUserCustomId.length > 20) {
      return Toast('커스텀 아이디는 20자 이하만 가능합니다', 'error');
    }

    try {
      setEditUserCustomIdLoading(true);

      await client.patch<Response<User>>(`/auth/me/asked`, {
        customId: editUserCustomId,
      });

      await reloadAsked();
    } catch (e) {
      if (e instanceof AxiosError) {
        return Toast(e.response?.data.message, 'error');
      }
    } finally {
      setEditUserCustomIdLoading(false);
      setOpenEditUserCustomId(false);
      setEditUserCustomId(undefined);
    }
  };

  const updateProfile = async (file?: File) => {
    if (!file) {
      setImageUploading(true);
      try {
        await client.patch<Response<User>>(`/auth/me/profile`, {
          imageId: null,
        });

        await update({
          ...session,
          user: {
            ...session.user,
            user: {
              ...session.user?.user,
              profile: null,
            },
          },
        });

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

    try {
      const { data } = await client.patch<Response<User>>(
        `/auth/me/profile`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            storage: 'profile',
          },
        }
      );

      await update({
        user: {
          user: {
            ...session.user?.user,
            profile: data.data,
          },
        },
      });

      Toast('프로필 사진을 변경했습니다', 'success');
    } catch (e) {
      return Toast('프로필 사진 변경에 실패했습니다', 'error');
    } finally {
      setImageUploading(false);

      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  };

  const updateNickname = async () => {
    if (!editUserNickname) return Toast('닉네임을 입력해주세요', 'error');

    try {
      setEditUserNicknameLoading(true);
      await client.patch(`/auth/me/nickname`, { nickname: editUserNickname });

      await update({
        user: {
          user: {
            ...session.user?.user,
            name: editUserNickname,
          },
        },
      });
    } catch (e) {
      return Toast('닉네임 변경에 실패했습니다', 'error');
    } finally {
      setEditUserNicknameLoading(false);
      setOpenEditUserNickname(false);
      setEditUserNickname(undefined);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditUserNickname(e.target.value);
  };
  if (loadingAsked) return <LoadingScreen />;
  if (!session || !askedUser)
    return <Error message='유저 정보를 찾을 수 없습니다' />;
  if (imageUploading) return <LoadingScreen />;
  if (!session?.user?.user.UserSchool)
    return <Error message='학교 정보를 찾을 수 없습니다' />;

  return (
    <>
      <Seo templateTitle='내 정보' />
      <DashboardLayout school={session.user.user.UserSchool}>
        <div className='mx-auto flex min-h-[80vh] w-full max-w-[600px] flex-col'>
          <div className='flex w-full flex-col rounded-[20px] border-2 border-[#E3E5E8] p-5'>
            <span className='text-xl font-bold'>내 정보</span>
            <div className='mt-2 flex flex-row items-center'>
              <div className='flex w-28 flex-col'>
                <Profile
                  defaultProfile={CSRsession?.user.user.profile}
                  size='medium'
                >
                  <button
                    onClick={() => {
                      updateProfile();
                    }}
                    className='absolute -right-1 -top-1 flex h-[19px] w-[19px] items-center justify-center rounded-[20px] bg-[#636363]'
                  >
                    <i className='fas fa-times mx-auto my-auto text-sm text-white' />
                  </button>
                </Profile>
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
                  accept='image/png, image/jpeg, image/jpg, image/gif'
                  maxLength={1}
                  onChange={(e) => {
                    if (e.target.files?.length === 0 || !e.target.files) return;
                    updateProfile(e.target.files[0]);
                  }}
                />
              </div>
              <div className='ml-5 flex w-full flex-col'>
                <div
                  className='flex w-full flex-row items-center border-b pb-2'
                  ref={refNicknameInput}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src='/svg/User.svg' alt='user' className='h-6 w-6' />
                  {openEditUserNickname ? (
                    <input
                      type='text'
                      className='ml-2 h-6 w-72 ring-0 focus:outline-none focus:ring-0 active:border-none'
                      placeholder='변경할 닉네임을 입력해주세요'
                      maxLength={20}
                      value={editUserNickname}
                      autoFocus
                      onChange={handleEditChange}
                    />
                  ) : (
                    <span className='ml-2 text-[#989898]'>
                      {CSRsession?.user.user.name}
                    </span>
                  )}
                  <button
                    className='ml-auto h-7 w-16 rounded-[5px] border border-[#D8D8D8] bg-[#F9F9F9] text-[#9A9A9A] hover:text-[#636363]'
                    onClick={
                      openEditUserNickname
                        ? () => {
                            updateNickname();
                          }
                        : () => {
                            setOpenEditUserNickname(true);
                          }
                    }
                  >
                    {editUserNicknameLoading ? (
                      <i className='fas fa-spinner fa-spin' />
                    ) : (
                      <>{openEditUserNickname ? '저장' : '수정'}</>
                    )}
                  </button>
                </div>
                <div
                  className='mt-2 flex w-full flex-row items-center border-b pb-2'
                  ref={refIdInput}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src='/svg/Email.svg' alt='email' className='h-6 w-6' />
                  {openEditUserCustomId ? (
                    <>
                      <input
                        type='text'
                        className='ml-2 h-6 w-72 ring-0 focus:outline-none focus:ring-0 active:border-none'
                        placeholder='커스텀 아이디를 입력해주세요 (영어, 숫자)'
                        maxLength={20}
                        value={editUserCustomId}
                        autoFocus
                        onChange={(e) => {
                          setEditUserCustomId(e.target.value);
                        }}
                        disabled={editUserCustomIdLoading}
                      />
                    </>
                  ) : (
                    <>
                      <span className='ml-2 text-[#989898]'>
                        {askedUser.user.customId ||
                          '유저 아이디를 설쟁해주세요'}
                      </span>
                    </>
                  )}
                  <button
                    className='ml-auto h-7 w-16 rounded-[5px] border border-[#D8D8D8] bg-[#F9F9F9] text-[#9A9A9A] hover:text-[#636363]'
                    onClick={
                      openEditUserCustomId
                        ? () => {
                            updateUserId();
                          }
                        : () => {
                            setOpenEditUserCustomId(true);
                          }
                    }
                  >
                    {editUserCustomIdLoading ? (
                      <i className='fas fa-spinner fa-spin' />
                    ) : (
                      <>{openEditUserCustomId ? '저장' : '수정'}</>
                    )}
                  </button>
                </div>
                <div className='mt-2 flex w-full flex-row items-center border-b pb-2'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src='/svg/Phone.svg' alt='user' className='h-6 w-6' />
                  <span className='ml-2 font-light text-[#989898]'>
                    {session.user.user.phone?.slice(0, 3) +
                      '-' +
                      session.user.user.phone?.slice(3, 4) +
                      '***-' +
                      session.user.user.phone?.slice(7, 8) +
                      '***'}
                  </span>
                </div>
                <div className='mt-2 flex w-full flex-row items-center'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src='/svg/Home.svg' alt='user' className='h-6 w-6' />
                  <span className='ml-2 text-[#989898]'>
                    {session.user.user.UserSchool.school.defaultName +
                      ' ' +
                      session.user.user.UserSchool.grade +
                      '학년'}
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
              {session.user.user.provider === 'id' ? (
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
            className='hover:bg-schoolmate-500 mt-5 flex h-[60px] w-full items-center justify-center rounded-[15px] border border-[#D8D8D8] font-bold text-[#939393] hover:text-white'
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
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login?redirectTo=/auth/me',
        permanent: false,
      },
    };
  } else {
    if (!session.user?.user.userSchoolId) {
      return {
        redirect: {
          destination: '/auth/verify',
          permanent: false,
        },
      };
    }
    return {
      props: {
        session,
      },
    };
  }
};

export default MyPage;
