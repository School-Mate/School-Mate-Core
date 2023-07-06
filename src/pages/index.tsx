import { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';

import client from '@/lib/client';

import DashboardLeftSection from '@/components/Dashboard/LeftSection';
import DashboardRightSection from '@/components/Dashboard/RightSection';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { Response } from '@/types/client';
import { User } from '@/types/user';

const HomePage: NextPage<HomePageProps> = ({ isLogged, school }) => {
  if (isLogged && school)
    return (
      <DashboardLayout school={school}>
        <Seo />
        <div className='mx-auto mt-5 flex max-w-[1280px] flex-row justify-center'>
          <DashboardLeftSection
            articles={[
              {
                title: '사이트 ㅈ망한거같으면 개추 ㅋㅋ',
                content: '일단 나부터~',
                createdAt: new Date(),
                isAnonymous: false,
                user: {
                  name: '장정훈',
                },
                board: '성소수자게시판',
              },
              {
                title: '사이트 ㅈ망한거같으면 개추 ㅋㅋ',
                content: '일단 나부터~',
                createdAt: new Date(),
                isAnonymous: false,
                user: {
                  name: '장정훈',
                },
                board: '성소수자게시판',
              },
              {
                title: '사이트 ㅈ망한거같으면 개추 ㅋㅋ',
                content: '일단 나부터~',
                createdAt: new Date(),
                isAnonymous: false,
                user: {
                  name: '장정훈',
                },
                board: '성소수자게시판',
                titleImage: '/pepe.jpg',
              },
            ]}
          />
          <DashboardRightSection />
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

interface HomePageProps {
  isLogged: boolean;
  user?: User;
  school?: ISchoolInfoRow;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    req: { cookies },
  } = ctx;

  try {
    const { data: userData } = await client.get<Response<User>>('/auth/me', {
      headers: {
        Authorization: 'Bearer ' + cookies.Authorization,
      },
    });
    const { data: schoolData } = await client.get<Response<ISchoolInfoRow>>(
      `/school/${cookies.schoolId}`
    );

    return {
      props: {
        isLogged: true,
        user: userData.data,
        school: schoolData.data,
      },
    };
  } catch (error) {
    if (cookies.schoolId) {
      const { data } = await client.get<Response<ISchoolInfoRow>>(
        `/school/${cookies.schoolId}`
      );

      return {
        props: {
          isLogged: false,
          user: null,
          school: data.data,
        },
      };
    }

    return {
      props: {
        isLogged: false,
      },
    };
  }
};

export default HomePage;
