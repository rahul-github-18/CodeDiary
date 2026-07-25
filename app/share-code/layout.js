import { SITE_URL, SITE_NAME, generateOpenGraph, generateTwitter } from '@/lib/seo';

export const metadata = {
  title: `Share Code Snippet | ${SITE_NAME}`,
  description: 'Instantly share clean code snippets, formatted syntax, and programming solutions with teammates and developers on CodeDiary.',
  alternates: {
    canonical: `${SITE_URL}/share-code`,
  },
  openGraph: generateOpenGraph({
    title: `Share Code Snippet | ${SITE_NAME}`,
    description: 'Instantly share clean code snippets, formatted syntax, and programming solutions with teammates and developers on CodeDiary.',
    url: `${SITE_URL}/share-code`,
  }),
  twitter: generateTwitter({
    title: `Share Code Snippet | ${SITE_NAME}`,
    description: 'Instantly share clean code snippets, formatted syntax, and programming solutions with teammates and developers on CodeDiary.',
  }),
};

export default function ShareCodeLayout({ children }) {
  return children;
}
