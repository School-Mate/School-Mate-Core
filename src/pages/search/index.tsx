import { AxiosError } from "axios";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import useSWR from "swr";

import client from "@/lib/client";
import clsxm from "@/lib/clsxm";
import useSchool from "@/lib/hooks/useSchool";
import useUser from "@/lib/hooks/useUser";

import DashboardRightSection from '@/components/Dashboard/RightSection';
import Empty from "@/components/Empty";
import Error from "@/components/Error";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Loading, { LoadingScreen } from "@/components/Loading";
import Seo from "@/components/Seo";

import { ArticleItem } from "@/pages/board/[boardId]";

import { Article, Board } from "@/types/article";
import { Response } from "@/types/client";

interface SearchProps {
  keyword: string;
  articles: Article[];
  error: boolean,
  message: string,
}

const Search: NextPage<SearchProps> = ({
  keyword,
  articles,
  error,
  message
}) => {
  const router = useRouter();
  const { user } = useUser();
  const { school } = useSchool();
  const { data: boards } = useSWR<Board[]>(`/board`);

  if (!user) return <LoadingScreen />;
  if (!school) return <LoadingScreen />;
  if (error) return <Error message={message} />;

  return (
    <>
      <Seo templateTitle="검색 결과" />
      <DashboardLayout user={user} school={school}>
        <div className='mx-auto mt-5 flex h-full min-h-[86vh] max-w-[1280px] flex-row justify-center'>
          <div className='h-full min-h-[86vh] w-full max-w-[874px]'>
            <div className='mb-7 flex h-[230px] flex-row rounded-[20px] border p-5'>
              {boards ? (
                <>
                  <div
                    className={clsxm(
                      'grid w-96 grid-flow-col grid-rows-5 gap-1'
                    )}
                  >
                    {boards
                      .filter((boardsBoard) => boardsBoard.default)
                      .slice(0, 10)
                      .map((boardsBoard, index) => (
                        <Link
                          href={`/board/${boardsBoard.id}`}
                          key={index}
                          className={clsxm(
                            'flex items-center rounded-[10px] px-2 py-2 text-base hover:bg-gray-100',
                          )}
                        >
                          {boardsBoard.name}
                        </Link>
                      ))}
                  </div>
                  <div className='mx-4 h-full border' />
                  <div
                    className={clsxm(
                      'grid w-full grid-flow-col grid-rows-5 gap-1'
                    )}
                  >
                    {boards
                      .filter((boardsBoard) => !boardsBoard.default)
                      .slice(0, 19)
                      .map((boardsBoard, index) => (
                        <Link
                          href={`/board/${boardsBoard.id}`}
                          key={index}
                          className={clsxm(
                            'flex w-32 items-center rounded-[10px] px-2 py-2 text-base hover:bg-gray-100',
                          )}
                        >
                          {boardsBoard.name}
                        </Link>
                      ))}
                    <Link
                      className='text-schoolmate-500 flex w-32 items-center rounded-[10px] px-2 py-2 text-base font-bold hover:bg-gray-100'
                      href='/board'
                    >
                      더보기
                    </Link>
                  </div>
                </>
              ) : (
                <div className='flex h-full w-full flex-col items-center justify-center'>
                  <Loading />
                </div>
              )}
            </div>
            <div className='flex h-full min-h-[80vh] w-full flex-col rounded-[20px] border-2 border-[#E3E5E8] p-7'>
              <div className='text-schoolmate-400 border-schoolmate-400 mb-3 flex flex-row border-b-2 pb-3'>
                <h1
                  className='cursor-pointer text-3xl font-bold'
                  onClick={() => {
                    Router.push(`/search?keyword=${keyword}`);
                  }}
                >'{keyword}' 검색 결과</h1>
              </div>
              {articles.length === 0 ? (
                <div className='mt-4 flex h-[80vh] flex-col rounded-[10px] border'>
                  <Empty />
                  <div className='flex flex-row items-center justify-center text-[9pt] font-normal leading-[18px] text-[#707070]'></div>
                </div>
              ) : (
                <>
                  <div className='mt-2 flex h-full min-h-[80vh] flex-col'>
                    {articles.map((article, index) => (
                      <ArticleItem
                        key={index}
                        board={article.Board}
                        article={article}
                        className={clsxm(
                          index === 0 &&
                          'rounded-t-[10px] border-l border-r border-t pt-3',
                          index === articles.length - 1 &&
                          'mb-5 rounded-b-[10px] border-b border-l border-r pb-3',
                          index !== 0 &&
                          index !== articles.length - 1 &&
                          'border-l border-r pb-3 pt-3',
                          'border-b'
                        )}
                      />
                    ))}
                    <div className='mx-auto mt-auto flex w-32 flex-row items-center justify-center'>
                      {/* {page != 1 ? (
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
                      )} */}
                    </div>
                  </div>
                </>

              )}
            </div>
          </div>
          <DashboardRightSection school={school} user={user} />

        </div>
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    req: { cookies },
    query: { boardId, keyword },
  } = ctx;

  try {
    const { data: searchData } = await client.get<Response<{
      board: Board[];
      article: Article[];
    }>>(
      `/board/search?keyword=${keyword}`,
      {
        headers: {
          Authorization: 'Bearer ' + cookies.Authorization,
        },
      }
    );

    return {
      props: {
        error: false,
        articles: searchData.data.article,
        message: null,
        keyword: keyword,
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
          articles: null,
          message: err.response?.data.message,
          keyword: keyword,
        },
      };
    }

    return {
      props: {
        error: true,
        articles: null,
        message: '알 수 없는 오류가 발생했습니다.',
        keyword: keyword,
      },
    };
  }
};

export default Search;