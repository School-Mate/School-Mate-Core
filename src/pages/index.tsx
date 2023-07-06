import { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';

import client from '@/lib/client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { Response } from '@/types/client';
import { User } from '@/types/user';

const HomePage: NextPage<HomePageProps> = ({ isLogged }) => {
  if (isLogged)
    return (
      <DashboardLayout>
        <Seo />
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
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    req: { cookies },
  } = ctx;
  if (!cookies.Authorization) {
    return {
      props: {
        isLogged: false,
        user: null,
      },
    };
  }

  try {
    const { data } = await client.get<Response<User>>('/auth/me', {
      headers: {
        Authorization: 'Bearer ' + cookies.Authorization,
      },
    });

    return {
      props: {
        isLogged: true,
        user: data.data,
      },
    };
  } catch (error) {
    return {
      props: {
        isLogged: false,
      },
    };
  }
};

export default HomePage;
