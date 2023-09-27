import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { GetServerSideProps, NextPage } from 'next';
import Router from 'next/router';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import client from '@/lib/client';
import clsxm from '@/lib/clsxm';
import Toast from '@/lib/toast';
import { authRedirectUrlGenerator } from '@/lib/utils';

import Checkbox from '@/components/CheckBox';
import Error from '@/components/Error';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Loading from '@/components/Loading';
import Seo from '@/components/Seo';

import { AskedQuestion, AskedQuestionWithPage, AskedUser } from '@/types/asked';
import { Response } from '@/types/client';

interface AskedProps {
  error: boolean;
  asked: AskedQuestionWithPage;
  message: string;
  session: Session;
}

const Asked: NextPage<AskedProps> = ({
  error,
  asked: askedData,
  message,
  session: {
    user: { user },
  },
}) => {
  const askedsEl = useRef<HTMLDivElement>(null);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [askedMessage, setAskedMessage] = useState<string>('');
  const [loadingAsked, setLoadingAsked] = useState<boolean>(false);
  const [autoScrollLock, setAutoScrollLock] = useState<boolean>(false);
  const [asked, setAsked] = useState<{
    user: AskedUser;
    pages: number;
  } | null>(askedData);
  const [askeds, setAskeds] = useState<AskedQuestion[]>(askedData.askeds);
  const [page, setPage] = useState<number>(1);
  const [ref, inView] = useInView();

  const scrollToBottom = () => {
    if (askedsEl.current) {
      askedsEl.current.scrollTo({
        top: askedsEl.current.scrollHeight,
      });
    }
  };

  const addAsked = async () => {
    if (!askedMessage) return Toast('질문을 입력해주세요!', 'error');

    try {
      const { data } = await client.post(`/asked/${asked?.user.userId}`, {
        question: askedMessage,
        isAnonymous: isAnonymous,
      });
      Router.reload();
      setAskedMessage('');
      Toast('질문을 성공적으로 추가되었습니다!', 'success');
    } catch (e) {
      if (e instanceof AxiosError) {
        return Toast(e.response?.data.message, 'error');
      }
    }
  };

  useEffect(() => {
    if (asked?.pages === page) return;
    if (inView && !loadingAsked) {
      setPage((prevState) => prevState + 1);
    }
  }, [inView, loadingAsked]);

  useEffect(() => {
    if (page === 1) return;
    if (asked?.pages === 0) return;
    fetchAsked();
  }, [page]);

  useEffect(() => {
    if (autoScrollLock) return;
    scrollToBottom();
  });

  const fetchAsked = async () => {
    try {
      setLoadingAsked(true);
      const { data } = await client.get<Response<AskedQuestionWithPage>>(
        `/asked/${
          askedData?.user.customId
            ? askedData.user.customId
            : askedData?.user.userId
        }?page=${page}`
      );

      setAutoScrollLock(true);
      setAsked(data.data);
      setAskeds((prevState) => [...data.data.askeds, ...prevState]);
    } catch (err) {
      if (err instanceof AxiosError) {
        Toast(err.response?.data.message, 'error');
      }
    } finally {
      setLoadingAsked(false);
    }
  };

  if (error) return <Error message={message} />;
  if (!asked || !askedData)
    return <Error message='에스크 정보를 불러오는데 실패했습니다.' />;

  return (
    <>
      <Seo templateTitle={asked.user.user.name + '님의 에스크'} />
      <DashboardLayout school={user.UserSchool}>
        <div className='mx-auto mt-5 flex h-full min-h-[86vh] max-w-[1280px] flex-col justify-center'>
          <div className='flex h-40 w-full flex-col rounded-[20px] border p-6'>
            <div className='flex flex-row items-center'>
              <div
                className='relative h-[70px] w-[70px] rounded-full border border-[#D8D8D8]'
                style={{
                  backgroundImage: asked.user.user.profile
                    ? `url(${
                        process.env.NEXT_PUBLIC_S3_URL +
                        '/' +
                        asked.user.user.profile
                      })`
                    : `url(/svg/CloverGray.svg)`,
                  backgroundColor: '#F1F1F1',
                  backgroundSize: asked.user.user.profile
                    ? 'cover'
                    : '40px 40px',
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
                'mt-4 overflow-hidden text-ellipsis whitespace-nowrap px-2 text-[11pt] leading-[18px] text-[#B0B0B0]'
              )}
            >
              {asked.user.statusMessage
                ? asked.user.statusMessage
                : '에스크를 둘러봐요!'}
            </div>
          </div>
          <div className='mt-7 flex h-full min-h-[70vh] flex-row rounded-[20px] border p-6'>
            <div className='mt-auto w-full'>
              <div
                className='mb-5 flex max-h-[60vh] flex-col space-y-5 overflow-y-scroll'
                ref={askedsEl}
              >
                <div ref={ref} className='w-full' />
                {loadingAsked && (
                  <div className='flex h-full w-full flex-col items-center'>
                    <Loading />
                  </div>
                )}
                {askeds.map((asked, index) => (
                  <AskedUsers asked={asked} key={index} />
                ))}
              </div>
              <div className='relative h-14 w-full'>
                <input
                  className={clsxm(
                    'h-full w-full rounded-[10px] border-[2px] border-none bg-[#F4F4F4] px-3 text-lg focus:outline-none focus:ring-0 focus:ring-[#BABABA]'
                  )}
                  type='text'
                  value={askedMessage}
                  placeholder='질문을 입력해주세요'
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
                  <div className='flex flex-row items-center justify-center px-4 py-2 text-sm text-gray-400'>
                    <Checkbox
                      id='anonymous'
                      checked={isAnonymous}
                      onChange={(e) => {
                        setIsAnonymous(e.target.checked);
                      }}
                      className='mr-2'
                    />
                    <label htmlFor='anonymous'>익명</label>
                  </div>
                  <button
                    className={clsxm(
                      'h-10 w-14 rounded-[10px] border-[2px] border-none bg-[#95BB72] hover:bg-[#7FAE5F] focus:outline-none active:bg-[#6F9E4F]'
                    )}
                    onClick={addAsked}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src='/svg/Send.svg'
                      className='mx-auto h-6 w-6'
                      alt='send'
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

const AskedUsers: React.FC<{
  asked: AskedQuestion;
  lastRef?: React.Ref<HTMLDivElement>;
}> = ({ asked, lastRef }) => {
  return (
    <>
      <div className='flex h-full w-full flex-col items-center' ref={lastRef}>
        <div className='relative flex h-full w-full flex-row items-center'>
          <div className='ml-3 max-w-xl break-words rounded-[10px] border-2 bg-white p-4 text-lg'>
            {asked.question}
          </div>
          <span className='ml-2 mt-auto text-sm font-light'>
            {dayjs(asked.createdAt).format('YYYY.MM.DD')}
          </span>
          <div className='bg-schoolmate-500 absolute -left-2 mx-2 flex h-[95%] w-1 flex-row rounded-[88px]' />
        </div>
        {asked.answer && (
          <div className='relative flex h-full w-full flex-row items-center'>
            <span className='ml-auto mt-auto text-sm font-light'>
              {dayjs(asked.answerTimeAt).format('YYYY.MM.DD')}
            </span>
            <div className='ml-3 mr-3 max-w-3xl rounded-[10px] bg-[#F5F5F5] p-4 text-lg'>
              {asked.answer}
            </div>
            <div className='absolute -right-2 mx-2 flex h-[95%] w-1 flex-row rounded-[88px] bg-[#FFDB5A]' />
          </div>
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    query: { askedId },
  } = ctx;
  const session = await getSession(ctx);
  const accessToken = session?.user.token.accessToken;

  if (!session) {
    return {
      redirect: {
        destination: authRedirectUrlGenerator(ctx.req.url as string),
        permanent: false,
      },
    };
  }

  try {
    const { data: askedData } = await client.get<Response<AskedUser>>(
      `/asked/${askedId}`,
      {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      }
    );

    return {
      props: {
        error: false,
        asked: askedData.data,
        message: null,
      },
    };
  } catch (err: any) {
    return {
      props: {
        error: true,
        board: null,
        message:
          err?.response?.data?.message || '알 수 없는 오류가 발생했습니다.',
      },
    };
  }
};

export default Asked;
