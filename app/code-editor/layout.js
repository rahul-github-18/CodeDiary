import { SITE_URL, SITE_NAME, generateOpenGraph, generateTwitter } from '@/lib/seo';

export const metadata = {
  title: `Online Code Editor & IDE | ${SITE_NAME}`,
  description: 'Write, compile, and run Java, Python, C++, and JavaScript code in an interactive browser IDE powered by CodeDiary.',
  alternates: {
    canonical: `${SITE_URL}/code-editor`,
  },
  openGraph: generateOpenGraph({
    title: `Online Code Editor & IDE | ${SITE_NAME}`,
    description: 'Write, compile, and run Java, Python, C++, and JavaScript code in an interactive browser IDE powered by CodeDiary.',
    url: `${SITE_URL}/code-editor`,
  }),
  twitter: generateTwitter({
    title: `Online Code Editor & IDE | ${SITE_NAME}`,
    description: 'Write, compile, and run Java, Python, C++, and JavaScript code in an interactive browser IDE powered by CodeDiary.',
  }),
};

export default function CodeEditorLayout({ children }) {
  return children;
}
