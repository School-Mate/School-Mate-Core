import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';

import client from '@/lib/client';
import useSchool from '@/lib/hooks/useSchool';
import useUser from '@/lib/hooks/useUser';

import DashboardLeftSection from '@/components/Dashboard/LeftSection';
import DashboardRightSection from '@/components/Dashboard/RightSection';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Layout from '@/components/layout/Layout';
import { LoadingScreen } from '@/components/Loading';
import Seo from '@/components/Seo';

import { Response } from '@/types/client';
import { UserSchoolWithUser } from '@/types/user';

interface HomePageProps {
  error: boolean;
  school: UserSchoolWithUser | null;
  message: string | null;
}

const HomePage: NextPage<HomePageProps> = ({ error }) => {
  const { user, isLoading: loadingUser } = useUser();
  const { school, isLoading: loadingSchool } = useSchool();

  if (loadingSchool && loadingUser && !error) return <LoadingScreen />;

  if (school && user && !error)
    return (
      <DashboardLayout user={user} school={school}>
        <Seo
          templateTitle={
            school.school.name ? school.school.name : school.school.defaultName
          }
        />
        <div className='mx-auto mt-5 flex min-h-screen max-w-[1280px] flex-row justify-center'>
          <DashboardLeftSection />
          <DashboardRightSection school={school} user={user} />
        </div>
      </DashboardLayout>
    );

  return (
    <>
      <Seo />
      <Layout>
        <main>
          <section className='flex h-[90vh] w-full flex-row items-center justify-center bg-[#FBFCFF]'>
            <div className='flex min-w-[75vw] max-w-[1666px]'>
              <div className='flex w-1/3 flex-col'>
                <span className='flex flex-row items-start justify-start text-4xl font-bold'>
                  <p className='text-5xl text-[#32A9FF]'>소통</p>
                  <p className='mt-auto'>하고 싶다면?</p>
                </span>
                <div className='mt-6 flex flex-col text-2xl text-[#888888]'>
                  <span>사소한 개인적인 이야기부터</span>
                  <span>학교와 공부에 관련된 질문들까지!</span>
                </div>
              </div>
              <div className='relative flex w-2/3 flex-col'>
                <svg
                  width='800'
                  height='895'
                  viewBox='0 0 886 895'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  xlinkHref='http://www.w3.org/1999/xlink'
                  className='absolute left-1/2 top-1/2 -mt-20'
                  style={{
                    transform: 'translate(-40%, -50%)',
                  }}
                >
                  <rect
                    y='381'
                    width='420'
                    height='420'
                    rx='100'
                    fill='url(#pattern0)'
                  />
                  <rect
                    x='466'
                    y='475'
                    width='420'
                    height='420'
                    rx='210'
                    fill='url(#pattern1)'
                  />
                  <rect
                    x='383'
                    width='420'
                    height='420'
                    rx='210'
                    fill='#DFECFF'
                  />
                  <defs>
                    <pattern
                      id='pattern0'
                      patternContentUnits='objectBoundingBox'
                      width='1'
                      height='1'
                    >
                      <use
                        xlinkHref='#image0_2921_188'
                        transform='translate(-0.250293) scale(0.00117233)'
                      />
                    </pattern>
                    <pattern
                      id='pattern1'
                      patternContentUnits='objectBoundingBox'
                      width='1'
                      height='1'
                    >
                      <use
                        xlinkHref='#image1_2921_188'
                        transform='translate(-0.250293) scale(0.00117233)'
                      />
                    </pattern>
                    <image
                      id='image0_2921_188'
                      width='1280'
                      height='853'
                      xlinkHref='/images/landing/section1_1.png'
                    />
                    <image
                      id='image1_2921_188'
                      width='1280'
                      height='853'
                      xlinkHref='/images/landing/section1_2.png'
                    />
                  </defs>
                </svg>
              </div>
            </div>
          </section>
          <section className='flex h-[1020px] w-full flex-row items-center justify-center bg-[#FBFFFB]'>
            <div className='flex h-full w-full max-w-[75vw]'>
              <div className='flex w-1/2 flex-col items-center justify-center space-y-7'>
                <div className='flex w-full flex-row space-x-7'>
                  <div
                    className='h-56 w-56 rounded-[50px] border-[3px] border-[#C2E8C2] bg-white p-16'
                    style={{
                      filter: 'drop-shadow(0px 14px 25px rgba(0, 0, 0, 0.12))',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src='/svg/Calendar.svg'
                      alt='calendar'
                      className='h-full w-full'
                    />
                  </div>
                  <div
                    className='h-56 w-56 rounded-[50px] border-[3px] border-[#C2E8C2] bg-white p-16'
                    style={{
                      filter: 'drop-shadow(0px 14px 25px rgba(0, 0, 0, 0.12))',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src='/svg/Meal.svg'
                      alt='meal'
                      className='h-full w-full'
                    />
                  </div>
                </div>
                <div className='flex w-full flex-row space-x-7'>
                  <div
                    className='h-56 w-56 rounded-[50px] border-[3px] border-[#C2E8C2] bg-white p-16'
                    style={{
                      filter: 'drop-shadow(0px 14px 25px rgba(0, 0, 0, 0.12))',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src='/svg/Bus.svg'
                      alt='Bus'
                      className='h-full w-full'
                    />
                  </div>
                  <div
                    className='h-56 w-56 rounded-[50px] border-[3px] border-[#C2E8C2] bg-white p-16'
                    style={{
                      filter: 'drop-shadow(0px 14px 25px rgba(0, 0, 0, 0.12))',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src='/svg/ChatLanding.svg'
                      alt='ChatLanding'
                      className='h-full w-full'
                    />
                  </div>
                </div>
              </div>
              <div className='flex h-full w-2/3 flex-col'>
                <div className='flex h-full flex-col items-end justify-center'>
                  <span className='text-4xl font-bold'>다양한 정보 제공!</span>
                  <div className='mt-6 flex flex-col items-end text-xl'>
                    <span>시간표, 급식표, 캘린더</span>
                    <span>학교 생활을 한 손에 정리한 스쿨메이트!</span>
                  </div>
                  <Link
                    href='/auth/login'
                    passHref
                    className='bg-schoolmate-500 mt-6 flex h-11 w-32 flex-row items-center justify-center rounded-[15px] text-lg font-bold text-white'
                  >
                    바로가기
                    <i className='fas fa-chevron-right ml-2' />
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <section className='flex h-[900px] w-full flex-row items-center justify-center bg-white'>
            <div className='flex h-full w-full max-w-[75vw]'>
              <div className='my-auto flex w-1/3 flex-col'>
                <span className='text-4xl font-bold'>
                  친구에게 질문해보자 💬
                </span>
                <div className='mt-6 flex flex-col text-xl'>
                  <span>궁금했던 게 있어?</span>
                  <span>여기선 마음껏 질문할 수 있어!</span>
                </div>
                <Link
                  href='/auth/login'
                  passHref
                  className='bg-schoolmate-500 mt-6 flex h-11 w-32 flex-row items-center justify-center rounded-[15px] text-lg font-bold text-white'
                >
                  바로가기
                  <i className='fas fa-chevron-right ml-2' />
                </Link>
              </div>
              <div className='my-auto ml-auto flex w-[60%] flex-col items-end'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src='/images/landing/section3_1.svg'
                  alt='section3_1'
                  className='h-full w-[90vw]'
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src='/images/landing/section3_2.svg'
                  alt='section3_2'
                  className='h-full w-[90vw]'
                />
              </div>
            </div>
          </section>
        </main>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    req: { cookies },
  } = ctx;

  if (!cookies.Authorization)
    return {
      props: {
        error: true,
        message: null,
      },
    };

  try {
    const { data: schoolData } = await client.get<Response<UserSchoolWithUser>>(
      `/auth/me/school`,
      {
        headers: {
          Authorization: 'Bearer ' + cookies.Authorization,
        },
      }
    );

    return {
      props: {
        error: false,
        message: null,
      },
    };
  } catch (err) {
    return {
      props: {
        error: true,
        message: '알 수 없는 오류가 발생했습니다.',
      },
    };
  }
};

export default HomePage;
