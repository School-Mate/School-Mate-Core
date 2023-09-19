import * as React from 'react';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className='background flex min-h-[100vh] w-full max-w-[100vw] items-center justify-center py-4 lg:h-[100vh] lg:py-0'>
        <div className='flex min-h-[90%] w-[90vw] max-w-[500px] flex-col rounded-[31px] bg-white px-6 lg:h-[90%]'>
          {children}
        </div>
      </main>
    </>
  );
}
