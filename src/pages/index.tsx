import { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';

import client from '@/lib/client';

import DashboardLeftSection from '@/components/Dashboard/LeftSection';
import DashboardRightSection from '@/components/Dashboard/RightSection';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { Response } from '@/types/client';
import { ISchoolInfoRow } from '@/types/school';
import { User } from '@/types/user';

interface HomePageProps {
  user?: User;
  school?: ISchoolInfoRow;
  isLogged: boolean;
  isVerifySchool: boolean;
  isSchoolSelected: boolean;
}

const HomePage: NextPage<HomePageProps> = ({
  isLogged,
  isSchoolSelected,
  isVerifySchool,
  school,
  user,
}) => {
  if (isLogged && isSchoolSelected && school && user)
    return (
      <DashboardLayout school={school}>
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
            askeds={[
              {
                user: {
                  name: '장정훈',
                },
                title: '테스트ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ',
              },
              {
                user: {
                  name: '장정훈',
                },
                title: '테스트ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ',
              },
              {
                user: {
                  name: '장정훈',
                },
                title: '테스트ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ',
              },
              {
                user: {
                  name: '장정훈',
                },
                title: '테스트ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ',
              },
              {
                user: {
                  name: '장정훈',
                },
                title: '테스트ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ',
              },
              {
                user: {
                  name: '장정훈',
                },
                title: '테스트ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ',
              },
              {
                user: {
                  name: '장정훈',
                },
                title: '테스트ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ',
              },
            ]}
            boards={[
              {
                name: '자유게시판',
                id: 1,
              },
              {
                name: '스터디게시판',
                id: 2,
              },

              {
                name: '자격증게시판',
                id: 3,
              },
              {
                name: '정보게시판',
                id: 4,
              },
              {
                name: '홍보게시판',
                id: 5,
              },
              {
                name: '장터게시판',
                id: 6,
              },
              {
                name: '파티원구해요',
                id: 7,
              },
              {
                name: '주식메이트',
                id: 8,
              },
              {
                name: '끝말잇기',
                id: 9,
              },
              {
                name: '족보게시판',
                id: 10,
              },
              {
                name: '학교생활',
                id: 11,
              },
              {
                name: '선생님추천',
                id: 12,
              },
            ]}
          />
          <DashboardRightSection school={school} todos={[]} user={user} />
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
      '/auth/me?school=1',
      {
        headers: {
          Authorization: 'Bearer ' + cookies.Authorization,
        },
      }
    );

    return {
      props: {
        isLogged: true,
        isVerifySchool: true,
        isSelectSchool: true,
        user: userData.data,
        school: userData.data.UserSchool.school,
      },
    };
  } catch (error) {
    try {
      const { data: userData } = await client.get<Response<User>>(
        '/auth/me?schoolverify=1',
        {
          headers: {
            Authorization: 'Bearer ' + cookies.Authorization,
          },
        }
      );

      if (userData.data?.UserSchoolVerify?.length != 0 || cookies.schoolId) {
        try {
          const { data: schoolData } = await client.get<
            Response<ISchoolInfoRow>
          >(
            `/school/${
              userData.data?.UserSchoolVerify?.length != 0
                ? userData.data.UserSchoolVerify[0].schoolId
                : cookies.schoolId
            }`
          );

          return {
            props: {
              isLogged: true,
              isSchoolSelected: true,
              isVerifySchool: false,
              user: userData.data,
              school: schoolData.data,
            },
          };
        } catch (error) {
          return {
            props: {
              isLogged: true,
              isSchoolSelected: false,
              isVerifySchool: false,
              user: userData.data,
            },
          };
        }
      } else {
        return {
          props: {
            isLogged: true,
            isSchoolSelected: false,
            isVerifySchool: false,
            user: userData.data,
          },
        };
      }
    } catch (error) {
      return {
        props: {
          isLogged: false,
          isSchoolSelected: false,
          isVerifySchool: false,
        },
      };
    }
  }
};

export default HomePage;
