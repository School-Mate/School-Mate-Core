import { AxiosError } from 'axios';
import { NextPage } from 'next';
import Link from 'next/link';
import Router from 'next/router';
import { Session } from 'next-auth';
import React from 'react';
import useSWR from 'swr';

import client from '@/lib/client';
import clsxm from '@/lib/clsxm';
import Toast from '@/lib/toast';

import Button from '@/components/buttons/Button';
import DashboardRightSection from '@/components/Dashboard/RightSection';
import Input from '@/components/Input';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Loading from '@/components/Loading';
import Seo from '@/components/Seo';

import { Board } from '@/types/article';

interface RequestBoardProps {
  session: Session;
}

const RequestBoard: NextPage<RequestBoardProps> = ({
  session: {
    user: { user },
  },
}) => {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [isWriting, setIsWriting] = React.useState(false);
  const { data: boards } = useSWR<Board[]>(`/board`);

  const requestBoardGenerate = async () => {
    if (!title) {
      return Toast('게시판 제목을 입력해주세요.', 'error');
    }

    if (!content) {
      return Toast('게시판 목적을 입력해주세요.', 'error');
    }

    if (content.length < 100) {
      return Toast('게시판 목적은 100자 이상이어야 합니다.', 'error');
    }

    setIsWriting(true);
    try {
      const { data } = await client.post(`/board/request`, {
        name: title,
        description: content,
      });

      Toast('게시판 개설 요청이 완료되었습니다.', 'success');
      Router.push(`/`);
    } catch (e) {
      if (e instanceof AxiosError) {
        return Toast(e.response?.data.message, 'error');
      }
    } finally {
      setIsWriting(false);
    }
  };
  return (
    <>
      <Seo templateTitle='게시판생성요청' />
      <DashboardLayout school={user.UserSchool}>
        <div className='mx-auto mt-5 flex max-w-[1280px] flex-row justify-center'>
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
                            'flex items-center rounded-[10px] px-2 py-2 text-base hover:bg-gray-100'
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
                            'flex w-32 items-center rounded-[10px] px-2 py-2 text-base hover:bg-gray-100'
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
            <div className='flex w-full max-w-[874px] flex-col rounded-[20px] border-2 border-[#E3E5E8] p-7'>
              <div className='text-schoolmate-400 border-schoolmate-400 mb-5 flex flex-row border-b-2 pb-3'>
                <h1
                  className='cursor-pointer text-3xl font-bold'
                  onClick={() => {
                    Router.push(`/`);
                  }}
                >
                  새 게시판 만들기
                </h1>
              </div>
              <div className='flex h-full flex-col space-y-3'>
                <Input
                  type='text'
                  placeholder='게시판 제목을 입력해주세요.'
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
                    placeholder={`게시판 목적을 입력해주세요.
익명 커뮤니티 게시판 개설 이용 약관
              
1. 목적
  - 본 약관은 익명 커뮤니티 게시판의 이용과 개설에 관한 규칙을 정함으로써, 이용자의 권익 보호와 게시판의 원활한 운영을 위하여 만들어졌습니다.
              
2. 게시판 개설자의 의무
  = 게시판 개설자는 다음과 같은 조건을 충족시켜야 합니다.
  - 본인의 실명으로 개설해야 합니다.
  - 타인의 명예를 훼손하거나 모욕하는 게시판을 개설해서는 안 됩니다.
  - 범죄와 결부된다고 판단되는 게시판을 개설해서는 안 됩니다.
  - 기타 관계 법령에 위배되는 게시판을 개설해서는 안 됩니다.
              
  게시판 개설자는 다음과 같은 의무를 부담합니다.
    - 본인이 개설한 게시판의 운영을 책임져야 합니다.
    - 게시판 이용자의 행위에 대한 관리 및 감시를 해야 합니다.
    - 광고 및 홍보를 목적으로 불필요한 게시글을 올리지 않아야 합니다.
    - 게시판 운영에 필요한 정보를 제공해야 합니다.
              
3. 게시물의 삭제 및 이용자의 제재
  - 본 게시판에서 위반 행위를 한 이용자의 게시물은 운영자의 판단에 따라 삭제될 수 있습니다.
  - 위반 행위를 한 이용자는 게시물 삭제뿐 아니라 게시판 이용 제재, 관계 기관에 신고될 수 있습니다.`}
                    className='h-[70vh] w-full resize-none px-4 py-2 outline-none'
                  />
                </div>
              </div>
              <Button
                variant='outline'
                className={clsxm(
                  'mx-auto mt-5 flex w-[70px] items-center justify-center rounded-[45px] px-4 py-2 font-bold',
                  isWriting && 'cursor-not-allowed'
                )}
                disabled={isWriting}
                onClick={requestBoardGenerate}
              >
                {isWriting ? (
                  <div className='flex h-7 w-7 items-center justify-center'>
                    <Loading />
                  </div>
                ) : (
                  <>완료</>
                )}
              </Button>
            </div>
          </div>
          <DashboardRightSection school={user.UserSchool} user={user} />
        </div>
      </DashboardLayout>
    </>
  );
};

export default RequestBoard;
