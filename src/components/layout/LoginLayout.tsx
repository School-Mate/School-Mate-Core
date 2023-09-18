import * as React from 'react';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className='background flex h-[100vh] w-full max-w-[100vw] items-center justify-center'>
        <div className='flex h-[90%] w-[90vw] max-w-[500px] flex-col rounded-[31px] bg-white px-6'>
          {children}
        </div>
      </main>
    </>
  );
}
