import { AxiosError } from 'axios';
import { GetServerSideProps, NextPage } from 'next';

import client from '@/lib/client';
import useSchool from '@/lib/hooks/useSchool';
import useUser from '@/lib/hooks/useUser';

import Error from '@/components/Error';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { LoadingScreen } from '@/components/Loading';
import Seo from '@/components/Seo';

import { AskedUser } from '@/types/asked';
import { Response } from '@/types/client';

interface AskedProps {
  error: boolean;
  asked: AskedUser;
  message: string;
}

const Asked: NextPage<AskedProps> = ({ error, asked, message }) => {
  const { user } = useUser();
  const { school } = useSchool();

  if (!user || !school) return <LoadingScreen />;
  if (error) return <Error message={message} />;

  return (
    <>
      <Seo templateTitle={asked.user.name + '님의 에스크'} />
      <DashboardLayout user={user} school={school}>
        <div className='mx-auto mt-5 flex h-full min-h-[86vh] max-w-[1280px] flex-row justify-center'></div>
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    req: { cookies },
    query: { askedId },
  } = ctx;

  try {
    const { data: askedData } = await client.get<Response<AskedUser>>(
      `/asked/${askedId}`,
      {
        headers: {
          Authorization: 'Bearer ' + cookies.Authorization,
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
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 401) {
        return {
          redirect: {
            destination: `/auth/login?redirectTo=/asked/${askedId}`,
            permanent: false,
          },
        };
      }

      return {
        props: {
          error: true,
          asked: null,
          message: err.response?.data.message,
        },
      };
    }

    return {
      props: {
        error: true,
        asked: null,
        message: '알 수 없는 오류가 발생했습니다.',
      },
    };
  }
};

export default Asked;
