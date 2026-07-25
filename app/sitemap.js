import { headers } from 'next/headers';
import { getCachedCurriculum } from '@/lib/cache';
import { getSiteUrl } from '@/lib/seo';
import { getTopicUrl } from '@/lib/slug';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const headersList = headers();
  const siteUrl = getSiteUrl(headersList);

  const routes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/share-code`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/code-editor`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  try {
    const { todos } = await getCachedCurriculum();
    if (todos && Array.isArray(todos)) {
      todos.forEach(topic => {
        routes.push({
          url: `${siteUrl}${getTopicUrl(topic)}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    }
  } catch (error) {
    console.error('Error generating sitemap dynamic routes:', error);
  }

  return routes;
}
