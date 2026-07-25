import { getCachedCurriculum } from '@/lib/cache';
import { SITE_URL } from '@/lib/seo';
import { getTopicUrl } from '@/lib/slug';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const routes = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/share-code`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/code-editor`,
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
          url: `${SITE_URL}${getTopicUrl(topic)}`,
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
