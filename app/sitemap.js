import { getCachedCurriculum } from '@/lib/cache';
import { getSiteUrl } from '@/lib/seo';
import { getTopicUrl } from '@/lib/slug';

export const revalidate = 86400; // Revalidate sitemap every 24 hours (ISR)

/**
 * @returns {Promise<import('next').MetadataRoute.Sitemap>}
 */
export default async function sitemap() {
  const siteUrl = getSiteUrl();

  const routes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
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
        if (topic) {
          const topicPath = getTopicUrl(topic);
          if (topicPath && topicPath !== '/') {
            routes.push({
              url: `${siteUrl}${topicPath.startsWith('/') ? topicPath : `/${topicPath}`}`,
              lastModified: topic.updatedAt ? new Date(topic.updatedAt) : new Date(),
              changeFrequency: 'weekly',
              priority: 0.8,
            });
          }
        }
      });
    }
  } catch (error) {
    console.warn('Sitemap using static routes fallback:', error?.message || error);
  }

  return routes;
}
