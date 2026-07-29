import { headers } from 'next/headers';
import { getSiteUrl, SITE_NAME, generateOpenGraph, generateTwitter } from '@/lib/seo';

export async function generateMetadata() {
  const headersList = headers();
  const siteUrl = getSiteUrl(headersList);

  return {
    title: `Enroll | ${SITE_NAME}`,
    description: 'Enroll and create an account on CodeDiary to start learning programming and tracking your progress.',
    alternates: {
      canonical: `${siteUrl}/enroll`,
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: generateOpenGraph({
      title: `Enroll | ${SITE_NAME}`,
      description: 'Enroll and create an account on CodeDiary to start learning programming and tracking your progress.',
      url: `${siteUrl}/enroll`,
      siteUrl,
    }),
    twitter: generateTwitter({
      title: `Enroll | ${SITE_NAME}`,
      description: 'Enroll and create an account on CodeDiary to start learning programming and tracking your progress.',
      siteUrl,
    }),
  };
}

export default function EnrollLayout({ children }) {
  return children;
}
