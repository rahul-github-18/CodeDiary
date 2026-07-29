import { getSiteUrl } from '@/lib/seo';

/**
 * Generates robots.txt rules for search engine crawling and indexing.
 * @returns {import('next').MetadataRoute.Robots}
 */
export default function robots() {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/login',
          '/enroll',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/login',
          '/enroll',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
