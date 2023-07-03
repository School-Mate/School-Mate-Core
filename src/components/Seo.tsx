import Head from 'next/head';
import { useRouter } from 'next/router';

// !STARTERCONF Change these default meta
const defaultMeta = {
  title: '스쿨메이트',
  siteName: '스쿨메이트',
  description: '우리 학교 친구들만 함께하는 학교 커뮤니티, 스쿨메이트',
  url: 'https://schoolmate.kr',
  type: 'website',
  robots: 'follow, index',
  image: 'https://tsnext-tw.thcl.dev/images/large-og.png',
};

type SeoProps = {
  date?: string;
  templateTitle?: string;
} & Partial<typeof defaultMeta>;

export default function Seo(props: SeoProps) {
  const router = useRouter();
  const meta = {
    ...defaultMeta,
    ...props,
  };
  meta['title'] = props.templateTitle
    ? `${props.templateTitle} | ${meta.siteName}`
    : meta.title;

  return (
    <Head>
      <title>{meta.title}</title>
      <meta name='robots' content={meta.robots} />
      <meta content={meta.description} name='description' />
      <meta property='og:url' content={`${meta.url}${router.asPath}`} />
      <link rel='canonical' href={`${meta.url}${router.asPath}`} />
      {/* Open Graph */}
      <meta property='og:type' content={meta.type} />
      <meta property='og:site_name' content={meta.siteName} />
      <meta property='og:description' content={meta.description} />
      <meta property='og:title' content={meta.title} />
      <meta name='image' property='og:image' content={meta.image} />
      {/* Twitter */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={meta.title} />
      <meta name='twitter:description' content={meta.description} />
      <meta name='twitter:image' content={meta.image} />
      {meta.date && (
        <>
          <meta property='article:published_time' content={meta.date} />
          <meta
            name='publish_date'
            property='og:publish_date'
            content={meta.date}
          />
        </>
      )}
      {/* Favicons */}
      <link rel='icon' href='/favicon.ico?v=2' />
      <meta name='msapplication-TileColor' content='#ffffff' />
      <meta name='msapplication-config' content='/browserconfig.xml' />
      <meta name='theme-color' content='#ffffff' />
      <meta name='manifest' content='/manifest.json' />
    </Head>
  );
}
