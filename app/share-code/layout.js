import { headers } from 'next/headers';
import { getSiteUrl, SITE_NAME, generateOpenGraph, generateTwitter } from '@/lib/seo';

export async function generateMetadata() {
  const headersList = headers();
  const siteUrl = getSiteUrl(headersList);

  return {
    title: `Share Code Snippet | ${SITE_NAME}`,
    description: 'Instantly share clean code snippets, formatted syntax, and programming solutions with teammates and developers on CodeDiary.',
    alternates: {
      canonical: `${siteUrl}/share-code`,
    },
    openGraph: generateOpenGraph({
      title: `Share Code Snippet | ${SITE_NAME}`,
      description: 'Instantly share clean code snippets, formatted syntax, and programming solutions with teammates and developers on CodeDiary.',
      url: `${siteUrl}/share-code`,
      siteUrl,
    }),
    twitter: generateTwitter({
      title: `Share Code Snippet | ${SITE_NAME}`,
      description: 'Instantly share clean code snippets, formatted syntax, and programming solutions with teammates and developers on CodeDiary.',
      siteUrl,
    }),
  };
}

export default function ShareCodeLayout({ children }) {
  return children;
}
