import { AxiosError } from 'axios';
import { NextPage } from 'next';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDetectClickOutside } from 'react-detect-click-outside';
import { useInView } from 'react-intersection-observer';
import useSWR from 'swr';

import client from '@/lib/client';
import clsxm from '@/lib/clsxm';
import useSchool from '@/lib/hooks/useSchool';
import useUser from '@/lib/hooks/useUser';
import Toast from '@/lib/toast';

import Button from '@/components/buttons/Button';
import Empty from '@/components/Empty';
import Error from '@/components/Error';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Loading, { LoadingScreen } from '@/components/Loading';
import Login from '@/components/Login';
import Seo from '@/components/Seo';

import { AskedQuestion, AskedQuestionWithMe, AskedUser } from '@/types/asked';
import { Response } from '@/types/client';
import { schoolMateDateFormat } from '@/lib/utils';
import dayjs from 'dayjs';

const Asked: NextPage = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const { school, isLoading: isSchoolLoding } = useSchool();
  const [enableEditFeed, setEnableEditFeed] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [selectedAsked, setSelectedAsked] = useState<string>();
  const [asked, setAsked] = useState<AskedQuestionWithMe>();
  const [answerType, setAnswerType] = useState<'deny' | 'accept'>();
  const [loadingAsked, setLoadingAsked] = useState<boolean>(false);
  const [loadingFirstAsked, setLoadingFirstAsked] = useState<boolean>(true);
  const [askedMessage, setAskedMessage] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [ref, inView] = useInView();
  const refEditFeed = useDetectClickOutside({
    onTriggered: () => setEnableEditFeed(false),
  });

  useEffect(() => {
    if (asked?.pages === 0) return;
    fetchAsked();
  }, [page]);

  useEffect(() => {
    setAnswerType(undefined);
  }, [selectedAsked]);

  useEffect(() => {
    if (!asked) return;
    if (page != 1) return;
    setSelectedAsked(asked.askeds[0].id);
  }, [asked]);

  useEffect(() => {
    if (asked?.pages === page) return;
    if (inView && !loadingAsked) {
      setPage((prevState) => prevState + 1);
    }
  }, [inView, loadingAsked]);

  const fetchAsked = async () => {
    setLoadingAsked(true);
    try {
      const { data } = await client.get<Response<AskedQuestionWithMe>>(
        `/auth/me/asked?page=${page}`
      );

      if (data.data.pages === 0) {
        setAsked(data.data);
        return;
      }

      setAsked((prevState) => {
        if (prevState) {
          return {
            ...data.data,
            askeds: [...prevState.askeds, ...data.data.askeds],
          };
        } else {
          return data.data;
        }
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        Toast(err.response?.data.message, 'error');
      }
    } finally {
      setLoadingAsked(false);
      setLoadingFirstAsked(false);
    }
  };

  const changeStatusMessage = async () => {
    try {
      const { data } = await client.post<Response<AskedUser>>(
        `/asked/changestatusmessage`,
        {
          message: statusMessage,
        }
      );
      Router.reload();
      Toast('피드를 변경했습니다.', 'success');
    } catch (err) {
      if (err instanceof AxiosError) {
        Toast(err.response?.data.message, 'error');
      }
    } finally {
      setEnableEditFeed(false);
    }
  };

  const copyAskedLink = () => {
    if (!asked?.user)
      return Toast('에스크 정보를 불러오는데 실패했습니다.', 'error');
    navigator.clipboard.writeText(
      window.location.host +
        '/asked/' +
        (asked.user.customId ? asked.user.customId : asked.user.userId)
    );

    Toast('에스크 링크를 복사했습니다.', 'success');
  };

  const selectAskedDeny = async () => {
    if (!selectedAsked) return Toast('답변할 질문을 선택해주세요!', 'error');

    try {
      const { data } = await client.post(`/asked/${selectedAsked}/deny`);

      Router.reload();

      Toast('답변을 거절했습니다.', 'success');
    } catch (err) {
      if (err instanceof AxiosError) {
        Toast(err.response?.data.message, 'error');
      }
    }
  };

  const selectAskedAccept = async () => {
    if (!selectedAsked) return Toast('답변할 질문을 선택해주세요!', 'error');

    try {
      const { data } = await client.post(`/asked/${selectedAsked}/reply`, {
        answer: askedMessage,
      });

      Router.reload();

      Toast('답변을 작성했습니다.', 'success');
    } catch (err) {
      if (err instanceof AxiosError) {
        Toast(err.response?.data.message, 'error');
      }
    }
  };

  const getSeletedAsked = (): AskedQuestion => {
    return asked?.askeds.find(
      (asked) => asked.id === selectedAsked
    ) as AskedQuestion;
  };

  if (isSchoolLoding || isUserLoading || loadingFirstAsked)
    return <LoadingScreen />;
  if (!user) return <Login redirectTo='/asked/me' />;
  if (!school) return <Error message='학교 정보를 불러오는데 실패했습니다.' />;
  if (!asked) return <Error message='에스크 정보를 불러오는데 실패했습니다.' />;

  return (
    <>
      <Seo templateTitle={asked.user.user.name + '님의 에스크'} />
      <DashboardLayout user={user} school={school}>
        <div className='mx-auto mt-5 flex h-full min-h-[86vh] max-w-[1280px] flex-col justify-center'>
          <div className='flex h-40 w-full flex-row items-center justify-between rounded-[20px] border p-9'>
            <div className='flex flex-col'>
              <div className='flex flex-row items-center'>
                <div
                  className='relative h-[70px] w-[70px] rounded-full border border-[#D8D8D8]'
                  style={{
                    backgroundImage: user.profile
                      ? `url(${
                          process.env.NEXT_PUBLIC_S3_URL + '/' + user.profile
                        })`
                      : `url(/svg/CloverGray.svg)`,
                    backgroundColor: '#F1F1F1',
                    backgroundSize: user.profile ? 'cover' : '40px 40px',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                />
                <div className='ml-3 flex max-w-[148px] flex-col whitespace-nowrap'>
                  <h1 className='w-full truncate overflow-ellipsis text-xl font-bold'>
                    {asked.user.user.name}
                  </h1>
                  <h2 className='-mt-1 truncate overflow-ellipsis text-sm font-normal text-[#707070]'>
                    @
                    {asked.user.customId
                      ? asked.user.customId
                      : asked.user.user.name}
                  </h2>
                </div>
              </div>
              <div
                className={clsxm(
                  'mt-4 overflow-hidden text-ellipsis whitespace-nowrap text-[11pt] leading-[18px] text-[#707070]',
                  !enableEditFeed ? 'px-2' : ''
                )}
                onClick={() => {
                  setEnableEditFeed(true);
                }}
                ref={refEditFeed}
              >
                {enableEditFeed ? (
                  <>
                    <input
                      placeholder='피드를 입력해주세요'
                      className='focus:ring-none w-full rounded-[10px] px-2 focus:border-[#BABABA] focus:outline-none focus:ring-0'
                      type='text'
                      maxLength={30}
                      autoFocus
                      onChange={(e) => {
                        setStatusMessage(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          changeStatusMessage();
                        }
                      }}
                    />
                  </>
                ) : (
                  <>
                    {asked.user.statusMessage
                      ? asked.user.statusMessage
                      : '피드를 입력해주세요'}
                  </>
                )}
              </div>
            </div>
            <div className='flex flex-col space-y-2'>
              <Button
                className='flex w-52 items-center justify-center rounded-[10px]'
                variant='outline'
                onClick={() => {
                  Router.push(`/auth/me`);
                }}
              >
                프로필 수정
              </Button>
              <Button
                className='flex w-52 items-center justify-center rounded-[10px]'
                variant='primary'
                onClick={() => {
                  copyAskedLink();
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src='/svg/share.svg'
                  className='mr-1'
                  width={20}
                  height={20}
                  alt='share'
                />
                공유하기
              </Button>
            </div>
          </div>
          <div className='mt-7 flex h-full min-h-[70vh] flex-row rounded-[20px] border p-6'>
            {asked.askeds.length === 0 ? (
              <>
                <div className='w-full items-center justify-center'>
                  <Empty />
                </div>
              </>
            ) : (
              <>
                <div className='flex h-[60vh] w-[443px] flex-col space-y-1 overflow-y-scroll'>
                  {asked.askeds.map((askedItem, index) => (
                    <AskedUsers
                      key={index}
                      asked={askedItem}
                      isSelect={askedItem.id === selectedAsked}
                      onClick={setSelectedAsked}
                      lastRef={
                        asked.askeds.length - 1 === index ? ref : undefined
                      }
                    />
                  ))}
                  {loadingAsked && (
                    <div className='flex w-full items-center justify-center'>
                      <Loading />
                    </div>
                  )}
                </div>
                <div
                  className={clsxm(
                    'ml-8 flex flex-1 flex-col items-start justify-end rounded-[10px] border px-3 py-3',
                    !getSeletedAsked() ? 'items-center justify-center' : ''
                  )}
                >
                  <div className='my-4 flex w-full flex-col items-center justify-center px-4'>
                    {getSeletedAsked() ? (
                      <>
                        <div className='flex h-full w-full flex-col'>
                          <div className='relative flex h-full w-full flex-row items-center'>
                            <div className='max-w-xl break-words rounded-[10px] border-2 bg-white p-4 text-base'>
                              {getSeletedAsked().question}
                            </div>
                            <span className='ml-2 mt-auto text-sm font-light'>
                              {dayjs(getSeletedAsked().createdAt).format(
                                'YYYY.MM.DD'
                              )}
                            </span>
                            <div className='bg-schoolmate-500 absolute -left-5 mx-2 flex h-[95%] w-1 flex-row rounded-[88px]' />
                          </div>

                          {getSeletedAsked().answer && (
                            <div className='relative mt-3 flex h-full w-full flex-row items-center'>
                              <span className='ml-auto mr-2 mt-auto text-sm font-light'>
                                {dayjs(getSeletedAsked().answerTimeAt).format(
                                  'YYYY.MM.DD'
                                )}
                              </span>
                              <div className='max-w-3xl rounded-[10px] bg-[#F5F5F5] p-4 text-base'>
                                {getSeletedAsked().answer}
                              </div>
                              <div className='absolute -right-5 mx-2 flex h-[95%] w-1 flex-row rounded-[88px] bg-[#FFDB5A]' />
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <Empty text='응답할 답변을 선택해주세요!' />
                      </>
                    )}
                  </div>
                  {getSeletedAsked() && (
                    <>
                      <div className='relative h-14 w-full'>
                        {answerType ? (
                          <>
                            {answerType === 'accept' && (
                              <>
                                <input
                                  className={clsxm(
                                    'h-full w-full rounded-[10px] border-[2px] border-none bg-[#F4F4F4] px-3 text-lg focus:outline-none focus:ring-0 focus:ring-[#BABABA]'
                                  )}
                                  type='text'
                                  placeholder='답장을 입력해주세요'
                                  onChange={(e) => {
                                    setAskedMessage(e.target.value);
                                  }}
                                />
                                <div
                                  className='absolute right-0 mx-2 flex flex-row'
                                  style={{
                                    bottom: '50%',
                                    transform: 'translateY(50%)',
                                  }}
                                >
                                  <button
                                    className={clsxm(
                                      'h-10 w-14 rounded-[10px] border-[2px] border-none bg-[#95BB72] hover:bg-[#7FAE5F] focus:outline-none active:bg-[#6F9E4F]'
                                    )}
                                    onClick={selectAskedAccept}
                                  >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src='/svg/Send.svg'
                                      className='mx-auto h-6 w-6'
                                      alt='send'
                                    />
                                  </button>
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {getSeletedAsked().process === 'pending' ? (
                              <div className='flex w-full flex-row space-x-5'>
                                <Button
                                  variant='outline'
                                  onClick={selectAskedDeny}
                                  className='flex h-11 w-full items-center justify-center rounded-[5px] border border-[#DFDFDF] text-gray-400 hover:bg-gray-100 active:bg-gray-200'
                                >
                                  거절
                                </Button>
                                <Button
                                  variant='outline'
                                  className='flex h-11 w-full items-center justify-center rounded-[5px]'
                                  onClick={() => {
                                    setAnswerType('accept');
                                  }}
                                >
                                  답변
                                </Button>
                              </div>
                            ) : (
                              <>
                                <div className='absolute flex h-full w-full items-center justify-center rounded-[10px] border-[2px] border-none bg-[#F4F4F4] px-3 text-lg focus:outline-none focus:ring-0 focus:ring-[#BABABA]'>
                                  <span>이미 처리된 답변입니다</span>
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

const AskedUsers: React.FC<{
  asked: AskedQuestion;
  onClick: (askedId: string) => void;
  isSelect?: boolean;
  lastRef?: React.Ref<HTMLDivElement>;
}> = ({ asked, onClick, isSelect, lastRef }) => {
  return (
    <>
      <div
        ref={lastRef}
        className={clsxm(
          'flex w-full cursor-pointer flex-row rounded-[10px] p-5',
          isSelect ? 'bg-[#F5F5F5]' : ''
        )}
        onClick={() => {
          onClick(asked.id);
        }}
      >
        <div
          className='relative h-[50px] w-[50px] rounded-full border border-[#D8D8D8]'
          style={{
            backgroundImage: asked.QuestionUser.profile
              ? `url(${
                  process.env.NEXT_PUBLIC_S3_URL +
                  '/' +
                  asked.QuestionUser.profile
                })`
              : `url(/svg/CloverGray.svg)`,
            backgroundColor: '#F1F1F1',
            backgroundSize: asked.QuestionUser.profile ? 'cover' : '30px 30px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
        <div className='ml-3 flex flex-col items-start justify-center'>
          <span className='font-bold'>
            {asked.isAnonymous ? '익명' : asked.QuestionUser.name}
            {asked.process === 'denied' && (
              <span className='ml-2 font-normal text-[#ACACAC]'>(거절됨)</span>
            )}
            {asked.process === 'success' && (
              <span className='text-schoolmate-500 ml-2 font-normal'>
                (답변완료)
              </span>
            )}
          </span>
          <span>
            {asked.isAnonymous
              ? "'익명'님에게 질문을 받았습니다"
              : `'${asked.QuestionUser.name}'님에게 질문을 받았습니다`}
          </span>
        </div>
        <div className='mb-auto ml-auto'>
          <span className='text-sm text-[#ACACAC]'>
            {schoolMateDateFormat(asked.createdAt)}
          </span>
        </div>
      </div>
    </>
  );
};

export default Asked;
