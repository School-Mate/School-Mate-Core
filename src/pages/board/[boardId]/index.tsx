import { AxiosError } from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import client from '@/lib/client';
import clsxm from '@/lib/clsxm';
import useSchool from '@/lib/hooks/useSchool';
import useUser from '@/lib/hooks/useUser';
import { schoolMateDateFormat } from '@/lib/utils';

import DashboardRightSection from '@/components/Dashboard/RightSection';
import Empty from '@/components/Empty';
import Error from '@/components/Error';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Loading, { LoadingScreen } from '@/components/Loading';
import NextImage from '@/components/NextImage';
import Seo from '@/components/Seo';

import { Article } from '@/types/article';
import { Board } from '@/types/board';
import { Response } from '@/types/client';

interface BoardPageProps {
  error: boolean;
  board: Board;
  message: string;
}

const Board: NextPage<BoardPageProps> = ({ error, board, message }) => {
  const [page, setPage] = useState<number>(1);
  const { user } = useUser();
  const { school } = useSchool();
  const { data: articles } = useSWR<{
    articles: Article[];
    totalPage: number;
  }>(`/board/${board?.id}/articles?page=${page}`);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [page]);

  if (!user) return <LoadingScreen />;
  if (!school) return <LoadingScreen />;

  if (error)
    return (
      <Error message={message}>
        <button
          className='mt-5 rounded-md px-3 py-1 font-bold hover:bg-gray-200'
          onClick={() => {
            Router.reload();
          }}
        >
          재시도
        </button>
      </Error>
    );

  return (
    <>
      <Seo templateTitle={board.name} />
      <DashboardLayout user={user} school={school}>
        <div className='mx-auto mt-5 flex h-full min-h-[86vh] max-w-[1280px] flex-row justify-center'>
          <div className='flex w-full max-w-[874px] flex-col rounded-[20px] border-2 border-[#E3E5E8] p-7'>
            <div className='text-schoolmate-400 border-schoolmate-400 mb-3 flex flex-row border-b-2 pb-3'>
              <h1
                className='cursor-pointer text-3xl font-bold'
                onClick={() => {
                  Router.push(`/board/${board.id}`);
                }}
              >
                {board.name}
              </h1>
            </div>
            <button
              className={clsxm(
                'duration-400 fixed hover:bg-gray-50',
                'border-schoolmate-500 bottom-0 z-10 mb-5 mr-5 h-12 w-12 rounded-full border-2 bg-white',
                'text-schoolmate-500 left-[50%] right-[50%] w-28 -translate-x-1/2 font-bold'
              )}
              onClick={() => {
                Router.push(`/board/${board.id}/write`);
              }}
            >
              <i className='far fa-edit mr-2' />
              글쓰기
            </button>
            {articles ? (
              articles.articles.length > 0 ? (
                <>
                  <div className='mt-2 flex h-full flex-col'>
                    {articles.articles.map((article, index) => (
                      <ArticleItem
                        key={index}
                        board={board}
                        article={article}
                        className={clsxm(
                          index === 0 &&
                            'rounded-t-[10px] border-l border-r border-t pt-3',
                          index === articles.articles.length - 1 &&
                            'mb-5 rounded-b-[10px] border-b border-l border-r pb-3',
                          index !== 0 &&
                            index !== articles.articles.length - 1 &&
                            'border-l border-r pb-3 pt-3',
                          'border-b'
                        )}
                      />
                    ))}
                    <div className='mx-auto mt-auto flex w-32 flex-row items-center justify-center'>
                      {page != 1 ? (
                        <>
                          <button
                            className={clsxm(
                              'text-lg font-bold',
                              'hover:bg-[#F9F9F9]',
                              'rounded-[10px]',
                              'flex flex-row items-center bg-white',
                              'z-10 flex h-9 w-9'
                            )}
                            onClick={() => {
                              setPage((prev) => prev - 1);
                            }}
                          >
                            <i className='fas fa-chevron-left mx-auto' />
                          </button>
                        </>
                      ) : (
                        <>
                          <div className={clsxm('h-9 w-9')} />
                        </>
                      )}
                      <span
                        className={clsxm(
                          'text-[9pt] font-normal leading-[18px] text-[#707070]',
                          'mx-2'
                        )}
                      >
                        {page} / {articles.totalPage}
                      </span>
                      {page != articles.totalPage ? (
                        <>
                          <button
                            className={clsxm(
                              'text-lg font-bold',
                              'hover:bg-[#F9F9F9]',
                              'rounded-[10px]',
                              'flex flex-row items-center bg-white',
                              'z-10 flex h-9 w-9'
                            )}
                            onClick={() => {
                              setPage((prev) => prev + 1);
                            }}
                          >
                            <i className='fas fa-chevron-right mx-auto' />
                          </button>
                        </>
                      ) : (
                        <>
                          <div className={clsxm('h-9 w-9')} />
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className='mt-4 flex h-full flex-col rounded-[10px] border'>
                  <Empty />
                  <div className='flex flex-row items-center justify-center text-[9pt] font-normal leading-[18px] text-[#707070]'></div>
                </div>
              )
            ) : (
              <div className='mt-4 flex h-full flex-col items-center justify-center'>
                <div className='h-40 w-40'>
                  <Loading />
                </div>
              </div>
            )}
          </div>
          <DashboardRightSection school={school} user={user} />
        </div>
      </DashboardLayout>
    </>
  );
};

const ArticleItem: React.FC<{
  article: Article;
  board: Board;
  className?: string;
}> = ({ article, board, className }) => {
  return (
    <>
      <Link
        className={clsxm('fljustify-between flex px-4 py-2', className)}
        href={`/board/${board.id}/v/${article.id}`}
      >
        <div className='flex flex-col items-start'>
          <h1 className='mt-0.5 text-[13pt] font-semibold'>{article.title}</h1>
          <p className='-mt-2 text-[13pt] font-light text-[#8D8D8D]'>
            {article.content.length > 30
              ? article.content.slice(0, 30) + '...'
              : article.content}
          </p>
          <h3 className='flex flex-row items-center justify-center text-[9pt] font-normal text-[#707070]'>
            <span>{schoolMateDateFormat(article.createdAt)}</span>
            <span className='mx-1 text-[14pt]'>&#183;</span>
            <span>
              {article.isAnonymous || !article.User
                ? '익명'
                : article.User.name}
            </span>
          </h3>
        </div>
        <div className='my-auto ml-auto flex h-full'>
          <div className='mr-2 mt-auto'>
            {article.images.length != 0 && (
              <>
                <span className='mt-auto flex h-full items-center justify-center text-[9pt] font-normal text-[#707070]'>
                  <i className='fas fa-image mr-1' />
                  {article.images.length}
                </span>
              </>
            )}
          </div>
          {article.keyOfImages[0] && (
            <NextImage
              src={
                process.env.NEXT_PUBLIC_S3_URL + '/' + article.keyOfImages[0]
              }
              className='my-auto h-[85px] w-[85px] overflow-hidden rounded-[10px]'
              width={85}
              height={85}
              useSkeleton={true}
              alt='image'
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              imgClassName='h-full'
            />
          )}
        </div>
      </Link>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    req: { cookies },
    query: { boardId },
  } = ctx;

  try {
    const { data: boardData } = await client.get<Response<Board>>(
      `/board/${boardId}`,
      {
        headers: {
          Authorization: 'Bearer ' + cookies.Authorization,
        },
      }
    );

    return {
      props: {
        error: false,
        board: boardData.data,
        message: null,
      },
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 401) {
        return {
          redirect: {
            destination: `/auth/login?redirectTo=/board/${boardId}`,
            permanent: false,
          },
        };
      }

      return {
        props: {
          error: true,
          board: null,
          message: err.response?.data.message,
        },
      };
    }

    return {
      props: {
        error: true,
        board: null,
        message: '알 수 없는 오류가 발생했습니다.',
      },
    };
  }
};

export default Board;
