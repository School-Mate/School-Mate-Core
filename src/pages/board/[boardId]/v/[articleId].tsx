import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { GetServerSideProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import React from 'react';
import useSWR from 'swr';

import client from '@/lib/client';
import clsxm from '@/lib/clsxm';
import useSchool from '@/lib/hooks/useSchool';
import useUser from '@/lib/hooks/useUser';
import Toast from '@/lib/toast';
import { schoolMateDateFormat } from '@/lib/utils';

import Button from '@/components/buttons/Button';
import Checkbox from '@/components/CheckBox';
import DashboardRightSection from '@/components/Dashboard/RightSection';
import Error from '@/components/Error';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Loading, { LoadingScreen } from '@/components/Loading';
import Seo from '@/components/Seo';

import { Article, Comment, Recomment } from '@/types/article';
import { Board } from '@/types/board';
import { Response } from '@/types/client';
import { Like } from '@/types/like';
import { User } from '@/types/user';

interface BoardPageProps {
  error: boolean;
  board: Board;
  article: Article;
  message: string;
}

const ArticlePage: NextPage<BoardPageProps> = ({
  error,
  board,
  message,
  article,
}) => {
  const [commentPage, setCommentPage] = React.useState<number>(1);
  const [likeLoading, setLikeLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const [addCommentsLoading, setAddCommentsLoading] =
    React.useState<boolean>(false);
  const { user } = useUser();
  const { school } = useSchool();
  const { data: commnets, mutate: reloadComments } = useSWR<{
    comments: Comment[];
    totalPage: number;
  }>(`/board/${board?.id}/article/${article?.id}/comments?page=${commentPage}`);

  const addComment = async (
    comment: string,
    isAnonymous: boolean,
    type: 'comment' | 'recomment',
    parentId?: number
  ) => {
    if (!comment) return Toast('댓글을 입력해주세요.', 'error');
    if (type === 'recomment') {
      if (!parentId) return Toast('대댓글을 선택해주세요.', 'error');
    }
    setAddCommentsLoading(true);
    if (type === 'comment') {
      try {
        await client.post(`/board/article/${article?.id}/comment`, {
          content: comment,
          isAnonymous,
        });

        await reloadComments();
        Toast('댓글이 등록되었습니다.', 'success');
      } catch (err) {
        if (err instanceof AxiosError) {
          return Toast(err.response?.data.message, 'error');
        }

        return Toast('알 수 없는 오류가 발생했습니다.', 'error');
      } finally {
        setAddCommentsLoading(false);
      }
    } else {
      try {
        await client.post(
          `/board/article/${article?.id}/comment/${parentId}/recomment`,
          {
            content: comment,
            isAnonymous,
          }
        );

        await reloadComments();
        Toast('댓글이 등록되었습니다.', 'success');
      } catch (err) {
        if (err instanceof AxiosError) {
          return Toast(err.response?.data.message, 'error');
        }

        return Toast('알 수 없는 오류가 발생했습니다.', 'error');
      } finally {
        setAddCommentsLoading(false);
      }
    }
  };

  const addLike = async () => {
    try {
      setLikeLoading(true);
      const { data } = await client.post<Response<Like>>(
        `/board/article/${article?.id}/like`
      );
      if (!data.data) {
        return Toast('취소되었습니다.', 'error');
      }
      Toast('추천되었습니다.', 'success');
    } catch (err) {
      if (err instanceof AxiosError) {
        return Toast(err.response?.data.message, 'error');
      }
    } finally {
      setLikeLoading(false);
      router.replace(router.asPath);
    }
  };

  const adddisLike = async () => {
    try {
      setLikeLoading(true);
      const { data } = await client.post<Response<Like>>(
        `/board/article/${article?.id}/disLike`
      );
      if (!data.data) {
        return Toast('취소되었습니다.', 'error');
      }
      Toast('비추천되었습니다.', 'success');
    } catch (err) {
      if (err instanceof AxiosError) {
        return Toast(err.response?.data.message, 'error');
      }
    } finally {
      setLikeLoading(false);
      router.replace(router.asPath);
    }
  };

  const deleteArticleHandler = async () => {
    const confirm = window.confirm('삭제하시겠습니까?');
    if (!confirm) return;
    try {
      await client.delete(`/board/article/${article.id}`);
      Toast('게시글이 삭제되었습니다.', 'success');
      Router.push(`/board/${board.id}`);
    } catch (err) {
      if (err instanceof AxiosError) {
        return Toast(err.response?.data.message, 'error');
      }
    }
  };

  if (!school) return <LoadingScreen />;
  if (!user) return <LoadingScreen />;
  if (!article) return <LoadingScreen />;

  if (error) return <Error message={message} />;

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
            <div className='flex flex-col justify-between rounded-[10px] border'>
              <div className='mx-5 my-3'>
                <div className='flex w-full flex-row items-center justify-between'>
                  <span className='text-xl font-bold'>{article.title}</span>
                  <span className='text-sm text-gray-400'>
                    {schoolMateDateFormat(article.createdAt)}
                  </span>
                </div>
              </div>
              <hr />
              <div className='mx-5 my-3'>
                <div className='flex w-full flex-row items-center justify-between'>
                  <span className='text-sm font-bold'>
                    {article.isAnonymous ? '익명' : article.User.name}
                  </span>
                  <div className='text-sm text-gray-400'>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-5 flex h-full min-h-[60vh] w-full flex-col rounded-[10px] border'>
              <div className='flex h-full w-full flex-col'>
                <div className='h-full px-4 py-3'>
                  <pre className='whitespace-pre-wrap break-words text-lg'>
                    {article.content}
                  </pre>
                  <div className='mb-36 mt-10 flex flex-col space-y-4'>
                    {article.keyOfImages.map((image, index) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={index}
                        src={process.env.NEXT_PUBLIC_S3_URL + '/' + image}
                        alt='image'
                        className='h-full w-[350px] rounded-[10px] object-contain'
                      />
                    ))}
                  </div>
                </div>
                <div className='mt-auto flex flex-row justify-between px-4 py-3'>
                  <div className='flex flex-col'>
                    <div className='ml-2 flex flex-row space-x-3'>
                      <div className='text-schoolmate-500 flex flex-row items-center'>
                        <i className='far fa-thumbs-up mr-1' />
                        <span>{article.likeCounts || 0}</span>
                      </div>
                      <div className='flex flex-row items-center text-[#D17E7E]'>
                        <i className='far fa-thumbs-down mr-1' />
                        <span>{article.disLikeCounts || 0}</span>
                      </div>
                    </div>
                    <div className='mt-3 flex flex-row space-x-2'>
                      <button
                        className='rounded-[10px] border-none bg-[#F4F4F4] px-4 py-2 font-semibold text-[#969292] transition-all hover:bg-gray-200'
                        onClick={addLike}
                      >
                        <i className='far fa-thumbs-up mr-1 font-light text-[#BBBBBB]' />
                        추천
                      </button>
                      <button
                        className='rounded-[10px] border-none bg-[#F4F4F4] px-4 py-2 font-semibold text-[#969292] transition-all hover:bg-gray-200'
                        onClick={adddisLike}
                      >
                        <i className='far fa-thumbs-down mr-1 font-light text-[#BBBBBB]' />
                        비추천
                      </button>
                    </div>
                  </div>
                  <div className='mt-auto'>
                    {article.isMe ? (
                      <>
                        <button
                          onClick={deleteArticleHandler}
                          className='ml-auto mt-2 text-sm text-[#969696] underline underline-offset-2'
                        >
                          게시글삭제
                        </button>
                      </>
                    ) : (
                      <>
                        <button className='ml-auto mt-2 text-sm text-[#969696] underline underline-offset-2'>
                          게시글신고
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <hr />
                <div className='flex flex-col'>
                  {commnets ? (
                    <>
                      {commnets.comments.map((comment, index) => {
                        return (
                          <>
                            <Comment
                              comment={comment}
                              onSubmit={addComment}
                              key={index}
                              loading={addCommentsLoading}
                              user={user}
                              reloadComments={reloadComments}
                            />
                          </>
                        );
                      })}
                      <AddComment
                        onSubmit={addComment}
                        type='comment'
                        loading={addCommentsLoading}
                      />
                    </>
                  ) : (
                    <>
                      <div
                        className={clsxm(
                          'flex h-14 w-full flex-row items-center justify-center border-b',
                          'border-b-0 border-r'
                        )}
                      >
                        <Loading className='mx-auto h-14 w-14' />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DashboardRightSection school={school} user={user} />
        </div>
      </DashboardLayout>
    </>
  );
};

interface CommentProps {
  comment: Comment;
  reloadComments: () => void;
  loading: boolean;
  user?: User;
  onSubmit: (
    comment: string,
    isAnonymous: boolean,
    type: 'comment' | 'recomment',
    parentId?: number
  ) => void;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  onSubmit,
  reloadComments,
  loading,
  user,
}) => {
  const [openRecommnet, setOpenRecomment] = React.useState<boolean>(false);

  const deleteCommentHandler = async () => {
    const confirm = window.confirm('삭제하시겠습니까?');
    if (!confirm) return;
    try {
      await client.delete(
        `/board/article/${comment.articleId}/comment/${comment.id}`
      );
      Toast('댓글이 삭제되었습니다.', 'success');
      await reloadComments();
    } catch (err) {
      if (err instanceof AxiosError) {
        return Toast(err.response?.data.message, 'error');
      }
    }
  };

  return (
    <>
      <div
        className={clsxm(
          'flex h-[85px] w-full items-center justify-between px-4 py-2',
          openRecommnet ? 'border-b-0' : 'border-b'
        )}
      >
        <div className='flex h-full flex-row items-start justify-between'>
          <div className='mt-auto flex h-full flex-col'>
            <span
              className={clsxm(
                'font-semibold',
                comment.isDeleted ? 'text-gray-400' : ''
              )}
            >
              {comment.isAnonymous
                ? comment.isDeleted
                  ? '(삭제됨)'
                  : '익명'
                : comment.User?.name}
            </span>
            <span className='text-sm'>{comment.content}</span>
            <span className='mt-auto text-[10pt] text-[#8D8D8D]'>
              {dayjs(comment.createdAt).format('MM/DD HH:mm')}
            </span>
          </div>
        </div>
        <div className='mb-auto flex flex-row space-x-2'>
          <button
            onClick={() => {
              setOpenRecomment(!openRecommnet);
            }}
            className='text-sm text-[#969696] underline underline-offset-2'
          >
            답글
          </button>
          {user?.id != comment.userId && !comment.isDeleted && (
            <button
              onClick={() => {
                setOpenRecomment(!openRecommnet);
              }}
              className='text-sm text-[#969696] underline underline-offset-2'
            >
              추천
            </button>
          )}
          {comment.isMe && !comment.isDeleted && (
            <button
              onClick={deleteCommentHandler}
              className='text-sm text-[#969696] underline underline-offset-2'
            >
              삭제
            </button>
          )}
        </div>
      </div>
      {comment.recomments.length != 0 && (
        <>
          {comment.recomments.map((recomment, index) => (
            <ReComment
              reComment={recomment}
              key={index}
              user={user}
              reloadComments={reloadComments}
            />
          ))}
        </>
      )}
      {openRecommnet && (
        <>
          <div className='flex w-full flex-row items-center border-b'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src='/svg/Arrow-Down.svg'
              alt='arrow-down'
              className='ml-3 mr-1 h-7 w-7'
            />
            <AddComment
              type='recomment'
              loading={loading}
              onSubmit={(commentMessage, isAnonymous) => {
                onSubmit(commentMessage, isAnonymous, 'recomment', comment.id);
              }}
            />
          </div>
        </>
      )}
    </>
  );
};

interface AddCommetProps {
  onSubmit: (
    comment: string,
    isAnonymous: boolean,
    type: 'comment' | 'recomment',
    parentId?: number
  ) => void;
  type: 'comment' | 'recomment';
  loading: boolean;
  parentId?: number;
}

const AddComment: React.FC<AddCommetProps> = ({
  onSubmit,
  type,
  parentId,
  loading,
}) => {
  const [isAnonymous, setIsAnonymous] = React.useState<boolean>(false);
  const [content, setContent] = React.useState<string>('');

  return (
    <>
      <div
        className={clsxm(
          'flex h-12 w-full flex-row items-center border-b',
          type === 'recomment' ? 'border-b-0 border-r' : ''
        )}
      >
        <input
          type='text'
          placeholder='댓글을 입력하세요'
          className='h-full w-full px-4 py-3 text-base text-gray-700 outline-none transition-all duration-150 ease-in-out'
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
        <div className='flex w-24 items-center justify-center'>
          <Checkbox
            onChange={(e) => {
              setIsAnonymous(e.target.checked);
            }}
            id='isAnonymous'
            className='mr-2'
          />
          <label
            htmlFor='isAnonymous'
            className='text-sm font-semibold text-[#9E9E9E]'
          >
            익명
          </label>
        </div>
        <Button
          className='bg-schoolmate-400 disabled:bg ml-2 flex h-full w-28 items-center justify-center text-white'
          style={{
            borderRadius: type === 'recomment' ? '0 0 0 0' : '0 0 10px 0',
          }}
          disabled={loading}
          onClick={() => {
            onSubmit(content, isAnonymous, type, parentId);
            setContent('');
          }}
        >
          {loading ? (
            <>
              <div className='overflow-hidden'>
                <Loading className='flex h-11 w-11 items-center justify-center' />
              </div>
            </>
          ) : (
            <>등록</>
          )}
        </Button>
      </div>
    </>
  );
};

const ReComment: React.FC<{
  reComment: Recomment;
  user?: User;
  reloadComments: () => void;
}> = ({ reComment, user, reloadComments }) => {
  const deleteCommentHandler = async () => {
    const confirm = window.confirm('삭제하시겠습니까?');
    if (!confirm) return;
    try {
      await client.delete(
        `/board/article/${reComment.articleId}/comment/${reComment.commentId}/recomment/${reComment.id}`
      );
      Toast('댓글이 삭제되었습니다.', 'success');
      reloadComments();
    } catch (err) {
      if (err instanceof AxiosError) {
        return Toast(err.response?.data.message, 'error');
      }
    }
  };

  return (
    <>
      <div className='flex flex-row items-center justify-center border-b'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src='/svg/Arrow-Down.svg'
          alt='arrow-down'
          className='ml-3 mr-1 h-7 w-7'
        />
        <div
          className={clsxm(
            'flex h-[85px] w-full items-center justify-between px-4 py-2',
            'bg-[#F8F8F8]'
          )}
        >
          <div className='flex h-full flex-row items-start justify-between'>
            <div className='mt-auto flex h-full flex-col'>
              <span
                className={clsxm(
                  'font-semibold',
                  reComment.isDeleted ? 'text-gray-400' : ''
                )}
              >
                {reComment.isAnonymous
                  ? reComment.isDeleted
                    ? '(삭제됨)'
                    : '익명'
                  : reComment.User?.name}
              </span>
              <span className='text-sm'>{reComment.content}</span>
              <span className='mt-auto text-[10pt] text-[#8D8D8D]'>
                {dayjs(reComment.createdAt).format('MM/DD HH:mm')}
              </span>
            </div>
          </div>
          <div className='mb-auto flex flex-row space-x-2'>
            {user?.id != reComment.userId && !reComment.isDeleted && (
              <button className='text-sm text-[#969696] underline underline-offset-2'>
                추천
              </button>
            )}
            {user?.id === reComment.userId && !reComment.isDeleted && (
              <button
                onClick={deleteCommentHandler}
                className='text-sm text-[#969696] underline underline-offset-2'
              >
                삭제
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    req: { cookies },
    query: { boardId, articleId },
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

    const { data: articleData } = await client.get<Response<Article>>(
      `/board/${boardId}/article/${articleId}`,
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
        article: articleData.data,
        message: null,
      },
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 401) {
        return {
          redirect: {
            destination: `/auth/login?redirectTo=/board/${boardId}/v/${articleId}`,
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

export default ArticlePage;
