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
  const title = `Share Code Snippet | ${SITE_NAME}`;
  const description = 'Instantly share clean code snippets, formatted syntax, and programming solutions with teammates and developers on CodeDiary.';
  const canonical = `${siteUrl}/share-code`;

  return {
    title,
    description,
    keywords: [
      'share code snippet',
      'code sharing tool',
      'format code online',
      'syntax highlighter',
      'CodeDiary code share',
      'share java code',
      'share dsa solution',
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

export default function ShareCodeLayout({ children }) {
  const headersList = headers();
  const siteUrl = getSiteUrl(headersList);
  const title = `Share Code Snippet | ${SITE_NAME}`;
  const description = 'Instantly share clean code snippets, formatted syntax, and programming solutions with teammates and developers on CodeDiary.';
  const url = `${siteUrl}/share-code`;

  const webPageSchema = generateWebPageSchema({
    title,
    description,
    url,
    siteUrl,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Share Code', item: '/share-code' },
  ], siteUrl);

  const webAppSchema = generateWebApplicationSchema({
    name: 'CodeDiary Code Share Tool',
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
