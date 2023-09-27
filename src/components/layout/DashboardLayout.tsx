import Head from 'next/head';
import React from 'react';

import Header from '@/components/layout/DashboardHeader';

import { UserSchoolWithUser } from '@/types/user';

interface DashboardLayoutProps {
  children: React.ReactNode;
  school: UserSchoolWithUser;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  school,
}) => {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=1400' />
      </Head>
      <Header school={school} />
      <main className='mb-20'>{children}</main>
    </>
  );
};

export default DashboardLayout;
