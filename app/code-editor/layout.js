import { headers } from 'next/headers';
import { getSiteUrl, SITE_NAME, generateOpenGraph, generateTwitter } from '@/lib/seo';

export async function generateMetadata() {
  const headersList = headers();
  const siteUrl = getSiteUrl(headersList);

  return {
    title: `Online Code Editor & IDE | ${SITE_NAME}`,
    description: 'Write, compile, and run Java, Python, C++, and JavaScript code in an interactive browser IDE powered by CodeDiary.',
    alternates: {
      canonical: `${siteUrl}/code-editor`,
    },
    openGraph: generateOpenGraph({
      title: `Online Code Editor & IDE | ${SITE_NAME}`,
      description: 'Write, compile, and run Java, Python, C++, and JavaScript code in an interactive browser IDE powered by CodeDiary.',
      url: `${siteUrl}/code-editor`,
      siteUrl,
    }),
    twitter: generateTwitter({
      title: `Online Code Editor & IDE | ${SITE_NAME}`,
      description: 'Write, compile, and run Java, Python, C++, and JavaScript code in an interactive browser IDE powered by CodeDiary.',
      siteUrl,
    }),
  };
}

export default function CodeEditorLayout({ children }) {
  return children;
}
