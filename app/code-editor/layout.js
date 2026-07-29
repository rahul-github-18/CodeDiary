import { headers } from 'next/headers';
import {
  getSiteUrl,
  SITE_NAME,
  generateOpenGraph,
  generateTwitter,
  generateWebPageSchema,
  generateBreadcrumbSchema,
  generateWebApplicationSchema,
} from '@/lib/seo';

export async function generateMetadata() {
  const headersList = headers();
  const siteUrl = getSiteUrl(headersList);
  const title = `Online Code Editor & IDE | ${SITE_NAME}`;
  const description = 'Write, compile, and run Java, Python, C++, and JavaScript code in an interactive browser IDE powered by CodeDiary.';
  const canonical = `${siteUrl}/code-editor`;

  return {
    title,
    description,
    keywords: [
      'online code editor',
      'browser IDE',
      'compile java online',
      'run python in browser',
      'CodeDiary IDE',
      'online compiler',
      'dsa code editor',
    ],
    alternates: {
      canonical,
    },
    openGraph: generateOpenGraph({
      title,
      description,
      url: canonical,
      siteUrl,
    }),
    twitter: generateTwitter({
      title,
      description,
      siteUrl,
    }),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function CodeEditorLayout({ children }) {
  const headersList = headers();
  const siteUrl = getSiteUrl(headersList);
  const title = `Online Code Editor & IDE | ${SITE_NAME}`;
  const description = 'Write, compile, and run Java, Python, C++, and JavaScript code in an interactive browser IDE powered by CodeDiary.';
  const url = `${siteUrl}/code-editor`;

  const webPageSchema = generateWebPageSchema({
    title,
    description,
    url,
    siteUrl,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Code Editor', item: '/code-editor' },
  ], siteUrl);

  const webAppSchema = generateWebApplicationSchema({
    name: 'CodeDiary Online Code Editor & IDE',
    description,
    url,
    siteUrl,
  });

  const pageGraphJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [webPageSchema, breadcrumbSchema, webAppSchema],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageGraphJsonLd) }}
      />
      {children}
    </>
  );
}
