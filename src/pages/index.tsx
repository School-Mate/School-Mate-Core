import { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import useSWR from 'swr';

import client, { swrfetcher } from '@/lib/client';

import DashboardLeftSection from '@/components/Dashboard/LeftSection';
import DashboardRightSection from '@/components/Dashboard/RightSection';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { AskedUser } from '@/types/asked';
import { Board } from '@/types/board';
import { Response } from '@/types/client';
import { User } from '@/types/user';

interface HomePageProps {
  user?: User;
  isVerifySchool: boolean;
  isSchoolSelected: boolean;
}

const HomePage: NextPage<HomePageProps> = ({
  isSchoolSelected,
  isVerifySchool,
  user,
}) => {
  const { data: askeds } = useSWR<AskedUser[]>('/asked', swrfetcher);
  const { data: boards } = useSWR<Board[]>('/board', swrfetcher);

  if (isSchoolSelected && user)
    return (
      <DashboardLayout school={user.UserSchool.school}>
        <Seo />
        <div className='mx-auto mt-5 flex max-w-[1280px] flex-row justify-center'>
          <DashboardLeftSection
            articles={[
              {
                title: '테스트 1',
                content: '테스트........ㅁ.ㄴㅇㅁㄴㅇㅁㄴ ㄴㅁㅇㅁㅇㅁ',
                createdAt: new Date(),
                isAnonymous: false,
                user: {
                  name: '장정훈',
                },
                board: '테스트게시판1',
              },
              {
                title: '테스트 2',
                content: '테스트........ㅁ.ㄴㅇㅁㄴㅇㅁㄴ ㄴㅁㅇㅁㅇㅁ',
                createdAt: new Date(),
                isAnonymous: false,
                user: {
                  name: '장정훈',
                },
                board: '테스트게시판2',
              },
              {
                title: '테스트 3',
                content: '테스트........ㅁ.ㄴㅇㅁㄴㅇㅁㄴ ㄴㅁㅇㅁㅇㅁ',
                createdAt: new Date(),
                isAnonymous: false,
                user: {
                  name: '장정훈',
                },
                board: '테스트게시판3',
                titleImage: '/pepe.jpg',
              },
            ]}
            askeds={askeds}
            boards={boards}
            reviews={[
              {
                teacher: '이순신',
                content: '좋아요',
                star: 5,
                subject: '수학',
              },
            ]}
          />
          <DashboardRightSection
            school={user.UserSchool.school}
            todos={[]}
            user={user}
          />
        </div>
      </DashboardLayout>
    );

  return (
    <Layout>
      <Seo />

      <main></main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    req: { cookies },
  } = ctx;

  if (!cookies.Authorization && !cookies.schoolId)
    return {
      props: {
        isLogged: false,
        isSchoolSelected: false,
        isVerifySchool: false,
      },
    };

  try {
    const { data: userData } = await client.get<Response<User>>(
      '/auth/initiate',
      {
        headers: {
          Authorization: 'Bearer ' + cookies.Authorization,
        },
      }
    );

    return {
      props: userData.data,
    };
  } catch (error) {
    return {
      props: {
        isLogged: false,
        isSchoolSelected: false,
        isVerifySchool: false,
      },
    };
  }
};

export default HomePage;
