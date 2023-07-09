import Head from 'next/head';

import Header from '@/components/layout/DashboardHeader';

import { ISchoolInfoRow } from '@/types/school';

const DashboardLayout = ({
  children,
  school,
}: {
  children: React.ReactNode;
  school: ISchoolInfoRow;
}) => {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=1400' />
      </Head>
      <Header school={school} />
      <main>{children}</main>
    </>
  );
};

export default DashboardLayout;
