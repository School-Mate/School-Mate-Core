import { AxiosError } from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import Router from 'next/router';

import client from '@/lib/client';
import useSchool from '@/lib/hooks/useSchool';
import useUser from '@/lib/hooks/useUser';

import DashboardRightSection from '@/components/Dashboard/RightSection';
import Error from '@/components/Error';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { LoadingScreen } from '@/components/Loading';
import Seo from '@/components/Seo';

import { Board } from '@/types/board';
import { Response } from '@/types/client';

interface BoardPageProps {
  error: boolean;
  board: Board;
  message: string;
}

const Board: NextPage<BoardPageProps> = ({ error, board, message }) => {
  const { user } = useUser();
  const { school } = useSchool();

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
          <div className='text-schoolmate-500 w-full max-w-[874px] rounded-[20px] border-2'>
            <div className='mx-6 my-6 flex flex-col border-b pb-5'>
              <h3 className='text-3xl'>{board.name}</h3>
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

export default Board;
