import { NextPage } from 'next';

import useSchool from '@/lib/hooks/useSchool';
import useUser from '@/lib/hooks/useUser';

import DashboardLeftSection from '@/components/Dashboard/LeftSection';
import DashboardRightSection from '@/components/Dashboard/RightSection';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

const HomePage: NextPage = () => {
  const { user } = useUser();
  const { school } = useSchool();

  if (school && user)
    return (
      <DashboardLayout user={user} school={school}>
        <Seo />
        <div className='mx-auto mt-5 flex max-w-[1280px] flex-row justify-center'>
          <DashboardLeftSection />
          <DashboardRightSection school={school} user={user} />
        </div>
      </DashboardLayout>
    );

  return (
    <Layout>
      <Seo templateTitle='' />

      <main></main>
    </Layout>
  );
};

export default HomePage;
