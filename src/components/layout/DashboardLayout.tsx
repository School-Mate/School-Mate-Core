import Head from 'next/head';
import React from 'react';

import Header from '@/components/layout/DashboardHeader';

import { User, UserSchoolWithUser } from '@/types/user';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User;
  school: UserSchoolWithUser;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  user,
  school,
}) => {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=1400' />
      </Head>
      <Header user={user} school={school} />
      <main className='mb-20'>{children}</main>
    </>
  );
};

export default DashboardLayout;
