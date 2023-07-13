import { AxiosError } from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import Router from 'next/router';
import { useRef, useState } from 'react';

import client from '@/lib/client';
import clsxm from '@/lib/clsxm';
import useSchool from '@/lib/hooks/useSchool';
import useUser from '@/lib/hooks/useUser';
import Toast from '@/lib/toast';

import Button from '@/components/buttons/Button';
import Checkbox from '@/components/CheckBox';
import DashboardRightSection from '@/components/Dashboard/RightSection';
import Error from '@/components/Error';
import Input from '@/components/Input';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Loading, { LoadingScreen } from '@/components/Loading';
import Seo from '@/components/Seo';

import { Article } from '@/types/article';
import { Board } from '@/types/board';
import { Response } from '@/types/client';

interface BoardPageProps {
  error: boolean;
  board: Board;
  message: string;
}

const Wrtie: NextPage<BoardPageProps> = ({ error, board, message }) => {
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isWriting, setIsWriting] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const imageRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const { user } = useUser();
  const { school } = useSchool();

  const writeArticle = async () => {
    const uploadImages: string[] = [];
    try {
      setIsWriting(true);
      for await (const file of files) {
        const formData = new FormData();
        formData.append('img', file);
        try {
          const { data } = await client.post<Response<string>>(
            `/image`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                storage: 'article',
              },
            }
          );
          uploadImages.push(data.data);
        } catch (err) {
          if (err instanceof AxiosError) {
            for await (const image of uploadImages) {
              await client.delete(`/image/${image}`);
            }
            return Toast(err.response?.data.message, 'error');
          } else {
            return Toast('이미지 업로드중 오류가 발생했습니다.', 'error');
          }
        }
      }

      const { data: article } = await client.post<Response<Article>>(
        `/board/${board.id}`,
        {
          title,
          content,
          isAnonymous,
          images: uploadImages,
        }
      );

      Router.push(`/board/${board.id}/v/${article.data.id}`);
    } catch (err) {
      if (err instanceof AxiosError) {
        for await (const image of uploadImages) {
          await client.delete(`/image/${image}`);
        }

        return Toast(err.response?.data.message, 'error');
      } else {
        return Toast('알 수 없는 오류가 발생했습니다.', 'error');
      }
    } finally {
      setIsWriting(false);
    }
  };

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
        <div className='mx-auto mt-5 flex max-w-[1280px] flex-row justify-center'>
          <div className='flex w-full max-w-[874px] flex-col rounded-[20px] border-2 border-[#E3E5E8] p-7'>
            <div className='text-schoolmate-400 border-schoolmate-400 mb-5 flex flex-row border-b-2 pb-3'>
              <h1
                className='cursor-pointer text-3xl font-bold'
                onClick={() => {
                  Router.push(`/board/${board.id}`);
                }}
              >
                {board.name}
              </h1>
            </div>
            <div className='flex h-full flex-col space-y-3'>
              <Input
                type='text'
                placeholder='제목을 입력해주세요.'
                className='rounded-[10px] border-2 border-[#E3E5E8] px-4 py-3'
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              <div className='h-fit rounded-[10px] border-2 border-[#E3E5E8] pt-3'>
                <textarea
                  onChange={(e) => {
                    setContent(e.target.value);
                  }}
                  value={content}
                  placeholder={`아래는 이 스쿨메이트에 해당하는 요약 사항이며, 게시물 작성 전 커뮤니티 이용 규칙 전문을 반드시 확인하시기 바랍니다.
                  
- 정치·사회 관련 행위
- 홍보 및 판매 관련 행위
- 불법 촬영물 유통
- 타인의 권리를 침해하거나 불쾌감을 주는 행위
- 범죄, 불법 행위 등 법령을 위반하는 행위
- 욕설, 비하, 차별, 혐오, 자살, 폭력 관련 내용을 포함한 게시물 작성 행위
- 음란물, 성적 수치심을 유발하는 행위
                  
위와 같은 행위는 이용 규칙과 관련 법률에 제재 받을 수 있습니다.
`}
                  className='h-[50vh] w-full resize-none px-4 py-2 outline-none'
                />
                {files.length != 0 && (
                  <>
                    <div className='overflow-x flex h-40 flex-row space-x-5 border-b border-t px-3 py-4'>
                      {files.map((file, index) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={index}
                          className='h-full w-32 rounded-[10px] object-cover'
                          src={URL.createObjectURL(file)}
                          alt='file'
                        />
                      ))}
                      <div
                        className='h-full w-32 cursor-pointer'
                        onClick={() => {
                          if (!imageRef.current) return;
                          imageRef.current.click();
                        }}
                      >
                        <div className='flex h-full w-full items-center justify-center rounded-[10px] border-2 border-[#E3E5E8]'>
                          <i className='fas fa-plus text-4xl text-gray-400' />
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className='flex flex-row justify-between border-t'>
                  <div>
                    <input
                      type='file'
                      className='hidden'
                      accept='image/*'
                      ref={imageRef}
                      onChange={(e) => {
                        if (!e.target.files) return;
                        setFiles([...files, ...Array.from(e.target.files)]);
                        imageRef.current!.value = '';
                      }}
                    />
                    <button
                      className='ml-4 flex items-center rounded-md py-2 text-gray-400'
                      onClick={() => {
                        if (!imageRef.current) return;
                        imageRef.current.click();
                      }}
                    >
                      <i className='fas fa-paperclip mr-3 text-2xl' />
                      첨부파일
                    </button>
                  </div>
                  <div className='flex flex-row'>
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
                    <Button
                      className={clsxm(
                        'bg-schoolmate-500 rounded-rb items-cente flex w-28 items-center justify-center px-4 py-2 font-bold text-white',
                        isWriting && 'cursor-not-allowed'
                      )}
                      disabled={isWriting}
                      style={{
                        borderRadius: '0 0 10px 0',
                      }}
                      onClick={writeArticle}
                    >
                      {isWriting ? (
                        <div className='flex h-7 w-7 items-center justify-center'>
                          <Loading />
                        </div>
                      ) : (
                        <>글쓰기</>
                      )}
                    </Button>
                  </div>
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

export default Wrtie;
