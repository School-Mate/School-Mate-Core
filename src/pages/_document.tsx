import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <link
          rel='preload'
          href='/fonts/inter-var-latin.woff2'
          as='font'
          type='font/woff2'
          crossOrigin='anonymous'
        />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap'
          rel='stylesheet'
        />
        <script
          src='https://kit.fontawesome.com/575a60bd15.js'
          crossOrigin='anonymous'
          async
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&display=swap'
          rel='stylesheet'
        />
      </Head>
      <body className='background'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
