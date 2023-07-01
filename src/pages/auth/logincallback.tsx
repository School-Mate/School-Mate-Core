import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function LoginCallback() {
  return (
    <Layout>
      <Seo templateTitle='로그인 중..' />

      <main>
        <section className='bg-white'>
          <div className='layout text-schoolmate-600 flex min-h-screen flex-col items-center justify-center text-center'>
            <i className='fas fa-spinner fa-spin fa-5x'></i>
            <h1 className='mt-8 text-2xl lg:text-3xl'>로그인 중..</h1>
          </div>
        </section>
      </main>
    </Layout>
  );
}
