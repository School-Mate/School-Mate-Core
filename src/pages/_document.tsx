import { Head, Html, Main, NextScript } from 'next/document';

import { GA_TRACKING_ID } from '@/lib/googleAnalytics';

export default function Document() {
  return (
    <Html lang='ko'>
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
        <script
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2701426579223876'
          crossOrigin='anonymous'
        ></script>
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
