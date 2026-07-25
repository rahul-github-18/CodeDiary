import { headers } from 'next/headers';
import './globals.css';
import PWAContainer from '@/components/PWAContainer';
import { getSiteUrl, SITE_NAME, generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo';

export async function generateMetadata() {
  const headersList = headers();
  const siteUrl = getSiteUrl(headersList);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: 'CodeDiary - Daily Coding Tracker & Developer Learning Platform',
      template: `%s | ${SITE_NAME}`,
    },
    description: 'Organize your daily coding journey, practice programming questions, save code snippets, write notes, and track learning progress with CodeDiary.',
    keywords: [
      'coding tracker',
      'developer journal',
      'programming questions',
      'code diary',
      'coding interview practice',
      'data structures and algorithms',
      'learn programming',
      'java tutorial',
      'python tutorial'
    ],
    authors: [{ name: 'CodeDiary Team' }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: 'Education & Technology',
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
      title: 'CodeDiary - Daily Coding Tracker & Developer Learning Platform',
      description: 'Organize your daily coding journey, practice programming questions, save code snippets, write notes, and track learning progress with CodeDiary.',
      url: siteUrl,
      siteName: SITE_NAME,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: `${siteUrl}/icon.png`,
          width: 1200,
          height: 630,
          alt: 'CodeDiary Platform',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'CodeDiary - Daily Coding Tracker & Developer Learning Platform',
      description: 'Organize your daily coding journey, practice programming questions, save code snippets, write notes, and track learning progress with CodeDiary.',
      images: [`${siteUrl}/icon.png`],
    },
    manifest: '/manifest.json',
    icons: {
      icon: '/favicon.png',
      apple: '/favicon.png',
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

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([orgSchema, siteSchema]) }}
        />
      </head>
      <body>
        <PWAContainer />
        {children}
      </body>
    </html>
  );
}
