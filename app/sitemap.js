import { getSiteUrl } from '@/lib/seo';
import { getCachedCurriculum } from '@/lib/cache';
import { getCategorySlug, getTopicSlug } from '@/lib/slug';

export const revalidate = 86400; // Revalidate sitemap every 24 hours (ISR)

/**
 * Dynamic Sitemap listing only publicly accessible, indexable pages.
 * @returns {Promise<import('next').MetadataRoute.Sitemap>}
 */
export default async function sitemap() {
  const siteUrl = getSiteUrl();

  // Core static public pages
  const staticRoutes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/share-code`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/code-editor`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  let topicRoutes = [];

  try {
    const { todos } = await getCachedCurriculum();

    if (todos && Array.isArray(todos) && todos.length > 0) {
      topicRoutes = todos.map((topic) => {
        const catSlug = getCategorySlug(topic.category);
        const topSlug = getTopicSlug(topic.title);
        return {
          url: `${siteUrl}/${catSlug}/${topSlug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        };
      });
    }
  } catch (error) {
    console.error('[Sitemap] Error fetching curriculum topics for sitemap:', error);
  }

  // De-duplicate URLs in case of slug collisions
  const allRoutes = [...staticRoutes, ...topicRoutes];
  const uniqueRoutesMap = new Map();

  allRoutes.forEach((route) => {
    if (!uniqueRoutesMap.has(route.url)) {
      uniqueRoutesMap.set(route.url, route);
    }
  });

  return Array.from(uniqueRoutesMap.values());
}
