import { SITE_URL, SITE_NAME, generateOpenGraph, generateTwitter } from '@/lib/seo';

export const metadata = {
  title: `Login & Register | ${SITE_NAME}`,
  description: 'Sign in or create an account on CodeDiary to track your daily coding progress, solve practice problems, and manage programming notes.',
  alternates: {
    canonical: `${SITE_URL}/login`,
  },
  openGraph: generateOpenGraph({
    title: `Login & Register | ${SITE_NAME}`,
    description: 'Sign in or create an account on CodeDiary to track your daily coding progress, solve practice problems, and manage programming notes.',
    url: `${SITE_URL}/login`,
  }),
  twitter: generateTwitter({
    title: `Login & Register | ${SITE_NAME}`,
    description: 'Sign in or create an account on CodeDiary to track your daily coding progress, solve practice problems, and manage programming notes.',
  }),
};

export default function LoginLayout({ children }) {
  return children;
}
