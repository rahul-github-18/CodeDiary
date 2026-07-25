export const SITE_NAME = 'CodeDiary';

/**
 * Dynamically resolves the site URL from environment variables or request headers.
 * Never hardcodes incorrect domains, preventing broken indexing on Vercel deployments.
 */
export function getSiteUrl(headersList = null) {
  // 1. Explicit user-configured environment variable
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    let url = process.env.NEXT_PUBLIC_SITE_URL.trim();
    if (!url.startsWith('http')) url = `https://${url}`;
    return url.replace(/\/+$/, '');
  }

  // 2. Vercel production URL automatically assigned by Vercel
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    let url = process.env.VERCEL_PROJECT_PRODUCTION_URL.trim();
    if (!url.startsWith('http')) url = `https://${url}`;
    return url.replace(/\/+$/, '');
  }

  // 3. Vercel deployment URL
  if (process.env.VERCEL_URL) {
    let url = process.env.VERCEL_URL.trim();
    if (!url.startsWith('http')) url = `https://${url}`;
    return url.replace(/\/+$/, '');
  }

  // 4. Request Host header if passed
  if (headersList) {
    try {
      const host = typeof headersList.get === 'function' ? headersList.get('host') : null;
      if (host) {
        const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
        return `${protocol}://${host}`.replace(/\/+$/, '');
      }
    } catch (e) {
      // Continue to fallback
    }
  }

  // 5. Production Vercel fallback
  return 'https://kodediary.vercel.app';
}

/**
 * Generates targeted SEO keywords based on topic category, title, difficulty, and questions
 */
export function generateKeywords(topic = {}) {
  const category = topic.category || 'General';
  const title = topic.title || '';
  const difficulty = topic.difficulty || 'Beginner';

  const baseKeywords = [
    'coding tracker',
    'developer journal',
    'programming questions',
    'code diary',
    'coding interview practice',
    'data structures and algorithms',
    'learn programming'
  ];

  if (!title) return baseKeywords;

  const topicKeywords = [
    `${title.toLowerCase()}`,
    `${title.toLowerCase()} in ${category.toLowerCase()}`,
    `${category.toLowerCase()} ${title.toLowerCase()} tutorial`,
    `${title.toLowerCase()} practice questions`,
    `${title.toLowerCase()} coding interview`,
    `how to solve ${title.toLowerCase()}`,
    `${category.toLowerCase()} programming ${difficulty.toLowerCase()}`,
    `${title.toLowerCase()} code examples`,
    `${title.toLowerCase()} explanation and solutions`
  ];

  if (topic.questions && Array.isArray(topic.questions)) {
    topic.questions.forEach(q => {
      if (q.title) {
        topicKeywords.push(q.title.toLowerCase());
      }
      if (q.tags) {
        const tags = String(q.tags).split(',').map(t => t.trim().toLowerCase());
        topicKeywords.push(...tags);
      }
    });
  }

  return Array.from(new Set([...topicKeywords, ...baseKeywords])).filter(Boolean);
}

/**
 * Generates OpenGraph metadata object
 */
export function generateOpenGraph({ title, description, url, type = 'website', image = '/icon.png', siteUrl }) {
  const resolvedBaseUrl = siteUrl || getSiteUrl();
  const absoluteUrl = url ? (url.startsWith('http') ? url : `${resolvedBaseUrl}${url}`) : resolvedBaseUrl;
  const absoluteImage = image.startsWith('http') ? image : `${resolvedBaseUrl}${image}`;

  return {
    title: title ? `${title} | ${SITE_NAME}` : SITE_NAME,
    description,
    url: absoluteUrl,
    siteName: SITE_NAME,
    locale: 'en_US',
    type,
    images: [
      {
        url: absoluteImage,
        width: 1200,
        height: 630,
        alt: title || SITE_NAME,
      },
    ],
  };
}

/**
 * Generates Twitter Card metadata object
 */
export function generateTwitter({ title, description, image = '/icon.png', siteUrl }) {
  const resolvedBaseUrl = siteUrl || getSiteUrl();
  const absoluteImage = image.startsWith('http') ? image : `${resolvedBaseUrl}${image}`;

  return {
    card: 'summary_large_image',
    title: title ? `${title} | ${SITE_NAME}` : SITE_NAME,
    description,
    images: [absoluteImage],
  };
}

/**
 * Generates Schema.org JSON-LD Structured Data
 */
export function generateOrganizationSchema(siteUrl) {
  const url = siteUrl || getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: url,
    logo: `${url}/icon.png`,
    sameAs: [
      'https://github.com',
      'https://twitter.com'
    ],
    description: 'Organize your daily coding journey, save programming questions, write notes, format code snippets, and track learning progress.'
  };
}

export function generateWebSiteSchema(siteUrl) {
  const url = siteUrl || getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

export function generateTopicJsonLd(topic, topicId, siteUrl) {
  if (!topic) return null;

  const baseUrl = siteUrl || getSiteUrl();
  const url = `${baseUrl}/todo/${topicId}`;
  const title = `${topic.title || 'Topic'} in ${topic.category || 'Programming'}`;
  const description = `Learn ${topic.title || 'coding topic'} with practice questions, code snippets, notes, and step-by-step explanations.`;

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    headline: title,
    description: description,
    proficiencyLevel: topic.difficulty || 'Beginner',
    author: {
      '@type': 'Organization',
      name: SITE_NAME
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon.png`
      }
    },
    inLanguage: 'en-US'
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: topic.category || 'Curriculum',
        item: `${baseUrl}/?category=${encodeURIComponent(topic.category || 'General')}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: topic.title || 'Topic Details',
        item: url
      }
    ]
  };

  let faqSchema = null;
  if (topic.questions && topic.questions.length > 0) {
    const validQuestions = topic.questions.filter(q => q.title && (q.explanation || q.answer || q.description));
    if (validQuestions.length > 0) {
      faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: validQuestions.map(q => ({
          '@type': 'Question',
          name: q.title,
          acceptedAnswer: {
            '@type': 'Answer',
            text: q.explanation || q.answer || q.description || `Solution and explanation for ${q.title}`
          }
        }))
      };
    }
  }

  return [techArticleSchema, breadcrumbSchema, faqSchema].filter(Boolean);
}
