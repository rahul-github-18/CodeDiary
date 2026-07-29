import { headers } from 'next/headers';
import { getSiteUrl, SITE_NAME } from '@/lib/seo';

export async function generateMetadata() {
  const headersList = headers();
  const siteUrl = getSiteUrl(headersList);

  return {
    title: `Admin Dashboard | ${SITE_NAME}`,
    description: 'CodeDiary Administration Dashboard.',
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    alternates: {
      canonical: `${siteUrl}/admin`,
    },
  };
}

export default function AdminLayout({ children }) {
  return children;
}
