import { headers } from 'next/headers';
import { getSiteUrl } from '@/lib/seo';

export default function robots() {
  const headersList = headers();
  const siteUrl = getSiteUrl(headersList);

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
