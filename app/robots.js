import { getSiteUrl } from '@/lib/seo';

/**
 * @returns {import('next').MetadataRoute.Robots}
 */
export default function robots() {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
