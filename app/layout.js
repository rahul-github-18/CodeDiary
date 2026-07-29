import { headers } from 'next/headers';
import './globals.css';
import PWAContainer from '@/components/PWAContainer';
import {
  getSiteUrl,
  SITE_NAME,
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateWebPageSchema,
} from '@/lib/seo';

export async function generateMetadata() {
  const headersList = headers();
  const siteUrl = getSiteUrl(headersList);

  return {
    metadataBase: new URL(siteUrl),

    title: {
      default:
        'CodeDiary – DSA Learning Platform, Java Tutorials & Coding Interview Preparation',
      template: `%s | ${SITE_NAME}`,
    },

    description:
      'CodeDiary is a developer learning platform for mastering Data Structures & Algorithms (DSA), Java tutorials, SQL, System Design, and coding interview preparation.',

    applicationName: SITE_NAME,

    keywords: [
      'CodeDiary',
      'Code Diary',
      'code diary',
      'DSA learning platform',
      'Java tutorials',
      'Coding interview preparation',
      'Data Structures',
      'Algorithms',
      'SQL',
      'System Design',
      'LeetCode',
      'Coding Practice',
      'Developer Learning Platform',
      'Programming Tutorials',
      'Coding Notes',
    ],

    authors: [{ name: 'CodeDiary Team', url: siteUrl }],
    generator: 'Next.js',
    creator: SITE_NAME,
    publisher: SITE_NAME,

    category: 'Education & Technology',
    classification: 'Developer Learning Platform & Programming Tutorials',

    verification: {
      google: 'YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE',
    },

    referrer: 'origin-when-cross-origin',

    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },

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

    alternates: {
      canonical: siteUrl,
    },

    openGraph: {
      title:
        'CodeDiary – DSA Learning Platform, Java Tutorials & Coding Interview Preparation',

      description:
        'CodeDiary is a developer learning platform for mastering Data Structures & Algorithms (DSA), Java tutorials, SQL, System Design, and coding interview preparation.',

      url: siteUrl,

      siteName: SITE_NAME,

      locale: 'en_US',

      type: 'website',

      images: [
        {
          url: `${siteUrl}/icon.png`,
          width: 1200,
          height: 630,
          alt: 'CodeDiary – DSA Learning Platform & Coding Interview Preparation',
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',

      title:
        'CodeDiary – DSA Learning Platform, Java Tutorials & Coding Interview Preparation',

      description:
        'CodeDiary is a developer learning platform for mastering Data Structures & Algorithms (DSA), Java tutorials, SQL, System Design, and coding interview preparation.',

      images: [`${siteUrl}/icon.png`],

      creator: '@CodeDiary',

      site: '@CodeDiary',
    },

    manifest: '/manifest.json',

    icons: {
      icon: [
        { url: '/favicon.png', type: 'image/png' },
        { url: '/icon.png', sizes: '192x192', type: 'image/png' },
      ],
      shortcut: '/favicon.png',
      apple: [{ url: '/icon.png', sizes: '180x180', type: 'image/png' }],
    },

    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: SITE_NAME,
    },
  };
}

export const viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  const headersList = headers();
  const siteUrl = getSiteUrl(headersList);

  const orgSchema = generateOrganizationSchema(siteUrl);
  const siteSchema = generateWebSiteSchema(siteUrl);
  const pageSchema = generateWebPageSchema({
    title: 'CodeDiary – DSA Learning Platform, Java Tutorials & Coding Interview Preparation',
    description: 'CodeDiary is a developer learning platform for mastering Data Structures & Algorithms (DSA), Java tutorials, SQL, System Design, and coding interview preparation.',
    url: siteUrl,
    siteUrl,
    pageType: 'WebPage',
  });

  const rootGraphJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [orgSchema, siteSchema, pageSchema],
  };

  return (
    <html lang="en">
      <head>
        <meta name="google" content="notranslate" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(rootGraphJsonLd),
          }}
        />
      </head>

      <body>
        <PWAContainer />
        {children}
      </body>
    </html>
  );
}