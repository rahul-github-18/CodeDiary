import { headers } from 'next/headers';
import { getSiteUrl, SITE_NAME, generateOpenGraph, generateTwitter } from '@/lib/seo';

export async function generateMetadata() {
  const headersList = headers();
  const siteUrl = getSiteUrl(headersList);

  return {
    title: `Login & Register | ${SITE_NAME}`,
    description: 'Sign in or create an account on CodeDiary to track your daily coding progress, solve practice problems, and manage programming notes.',
    alternates: {
      canonical: `${siteUrl}/login`,
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: generateOpenGraph({
      title: `Login & Register | ${SITE_NAME}`,
      description: 'Sign in or create an account on CodeDiary to track your daily coding progress, solve practice problems, and manage programming notes.',
      url: `${siteUrl}/login`,
      siteUrl,
    }),
    twitter: generateTwitter({
      title: `Login & Register | ${SITE_NAME}`,
      description: 'Sign in or create an account on CodeDiary to track your daily coding progress, solve practice problems, and manage programming notes.',
      siteUrl,
    }),
  };
}

export default function LoginLayout({ children }) {
  return children;
}
