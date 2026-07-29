import { getCategorySlug, getTopicSlug } from './slug';

export const SITE_NAME = 'CodeDiary';
export const SITE_DESCRIPTION = 'CodeDiary is a developer learning platform for mastering Data Structures & Algorithms (DSA), Java tutorials, SQL, System Design, and coding interview preparation.';

/**
 * Dynamically resolves the site URL from environment variables or request headers.
 * Ensures clean absolute URLs without trailing slashes.
 */
export function getSiteUrl(headersList = null) {
  const formatUrl = (rawUrl) => {
    if (!rawUrl || typeof rawUrl !== 'string') return null;
    let url = rawUrl.trim();
    if (!url) return null;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    return url.replace(/\/+$/, '');
  };

  // 1. Explicit user-configured environment variable
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const formatted = formatUrl(process.env.NEXT_PUBLIC_SITE_URL);
    if (formatted) return formatted;
  }

  // 2. Vercel production URL automatically assigned by Vercel
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    const formatted = formatUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL);
    if (formatted) return formatted;
  }

  // 3. Vercel deployment URL
  if (process.env.VERCEL_URL) {
    const formatted = formatUrl(process.env.VERCEL_URL);
    if (formatted) return formatted;
  }

  // 4. Request Host header if passed
  if (headersList) {
    try {
      const host = typeof headersList.get === 'function' ? headersList.get('host') : null;
      if (host && typeof host === 'string') {
        const trimmedHost = host.trim();
        const isLocal = trimmedHost.includes('localhost') || trimmedHost.includes('127.0.0.1');
        if (!isLocal || process.env.NODE_ENV !== 'production') {
          const protocol = isLocal ? 'http' : 'https';
          return formatUrl(`${protocol}://${trimmedHost}`);
        }
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
    'CodeDiary',
    'Code Diary',
    'code diary',
    'DSA learning platform',
    'Java tutorials',
    'Coding interview preparation',
    'data structures and algorithms',
    'system design',
    'sql tutorials',
    'coding practice',
    'leetcode solutions',
    'developer learning platform',
    'programming questions',
    'coding tracker',
    'developer journal'
  ];

  if (!title) return baseKeywords;

  const topicKeywords = [
    `${title.toLowerCase()}`,
    `${title.toLowerCase()} in ${category.toLowerCase()}`,
    `${category.toLowerCase()} ${title.toLowerCase()} tutorial`,
    `${title.toLowerCase()} practice questions`,
    `${title.toLowerCase()} coding interview preparation`,
    `how to solve ${title.toLowerCase()}`,
    `${category.toLowerCase()} programming ${difficulty.toLowerCase()}`,
    `${title.toLowerCase()} code examples`,
    `${title.toLowerCase()} explanation and solutions`,
    `${SITE_NAME} ${title.toLowerCase()}`
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

  const formattedTitle = title 
    ? (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`)
    : `${SITE_NAME} – DSA Learning Platform & Coding Interview Preparation`;

  return {
    title: formattedTitle,
    description: description || SITE_DESCRIPTION,
    url: absoluteUrl,
    siteName: SITE_NAME,
    locale: 'en_US',
    type,
    images: [
      {
        url: absoluteImage,
        width: 1200,
        height: 630,
        alt: formattedTitle,
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

  const formattedTitle = title 
    ? (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`)
    : `${SITE_NAME} – DSA Learning Platform & Coding Interview Preparation`;

  return {
    card: 'summary_large_image',
    title: formattedTitle,
    description: description || SITE_DESCRIPTION,
    images: [absoluteImage],
    creator: '@CodeDiary',
    site: '@CodeDiary',
  };
}

/**
 * Generates Schema.org Organization Structured Data
 */
export function generateOrganizationSchema(siteUrl) {
  const url = siteUrl || getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}/#organization`,
    name: SITE_NAME,
    alternateName: ['Code Diary', 'code diary'],
    url: url,
    logo: {
      '@type': 'ImageObject',
      '@id': `${url}/#logo`,
      url: `${url}/icon.png`,
      caption: 'CodeDiary Logo',
      width: 512,
      height: 512,
    },
    image: {
      '@id': `${url}/#logo`,
    },
    sameAs: [
      'https://www.linkedin.com/in/rahul-ranjan-6b2ab424a/'
    ],
    description: SITE_DESCRIPTION,
  };
}

/**
 * Generates Schema.org WebSite Structured Data
 */
export function generateWebSiteSchema(siteUrl) {
  const url = siteUrl || getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}/#website`,
    url: url,
    name: SITE_NAME,
    alternateName: ['Code Diary', 'code diary'],
    description: 'DSA Learning Platform, Java Tutorials & Coding Interview Preparation',
    publisher: {
      '@id': `${url}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    inLanguage: 'en-US',
  };
}

/**
 * Generates Schema.org WebPage Structured Data
 */
export function generateWebPageSchema({ title, description, url, siteUrl, pageType = 'WebPage' }) {
  const baseUrl = siteUrl || getSiteUrl();
  const pageUrl = url ? (url.startsWith('http') ? url : `${baseUrl}${url}`) : baseUrl;
  return {
    '@context': 'https://schema.org',
    '@type': pageType,
    '@id': `${pageUrl}/#webpage`,
    url: pageUrl,
    name: title || SITE_NAME,
    description: description || SITE_DESCRIPTION,
    isPartOf: {
      '@id': `${baseUrl}/#website`
    },
    about: {
      '@id': `${baseUrl}/#organization`
    },
    inLanguage: 'en-US'
  };
}

/**
 * Generates Schema.org BreadcrumbList Structured Data
 */
export function generateBreadcrumbSchema(items = [], siteUrl) {
  const baseUrl = siteUrl || getSiteUrl();
  const pageUrl = items.length > 0 ? (items[items.length - 1].item.startsWith('http') ? items[items.length - 1].item : `${baseUrl}${items[items.length - 1].item}`) : baseUrl;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}/#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item.startsWith('http') ? item.item : `${baseUrl}${item.item}`
    }))
  };
}

/**
 * Generates Schema.org WebApplication Structured Data for interactive tools
 */
export function generateWebApplicationSchema({ name, description, url, siteUrl }) {
  const baseUrl = siteUrl || getSiteUrl();
  const pageUrl = url ? (url.startsWith('http') ? url : `${baseUrl}${url}`) : baseUrl;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${pageUrl}/#webapp`,
    name: name,
    url: pageUrl,
    description: description,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    publisher: {
      '@id': `${baseUrl}/#organization`
    }
  };
}

/**
 * Generates topic level structured data (TechArticle, BreadcrumbList, FAQPage)
 */
export function generateTopicJsonLd(topic, topicId, siteUrl) {
  if (!topic) return [];

  const baseUrl = siteUrl || getSiteUrl();
  const catSlug = getCategorySlug(topic.category);
  const topSlug = getTopicSlug(topic.title);
  const url = `${baseUrl}/${catSlug}/${topSlug}`;
  const title = `${topic.title} in ${topic.category} | ${SITE_NAME}`;
  const description = `Learn ${topic.title} (${topic.category}) with practice questions, code templates, notes, and interactive solutions on ${SITE_NAME}.`;

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${url}/#article`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${url}/#webpage`,
      url: url,
      name: title,
      description: description,
      isPartOf: {
        '@id': `${baseUrl}/#website`
      }
    },
    headline: `${topic.title} - ${topic.category} Tutorial`,
    description: description,
    proficiencyLevel: topic.difficulty || 'Beginner',
    articleBody: `Master ${topic.title} under ${topic.category}. Explore practice questions, code snippets, notes, and interview explanations.`,
    author: {
      '@id': `${baseUrl}/#organization`
    },
    publisher: {
      '@id': `${baseUrl}/#organization`
    },
    inLanguage: 'en-US'
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${url}/#breadcrumb`,
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
  if (topic.questions && Array.isArray(topic.questions) && topic.questions.length > 0) {
    const validQuestions = topic.questions.filter(q => q && q.title && (q.explanation || q.answer || q.description));
    if (validQuestions.length > 0) {
      faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${url}/#faq`,
        mainEntity: validQuestions.map(q => ({
          '@type': 'Question',
          name: q.title,
          acceptedAnswer: {
            '@type': 'Answer',
            text: q.explanation || q.answer || q.description || `Solution and step-by-step explanation for ${q.title}`
          }
        }))
      };
    }
  }

  return [techArticleSchema, breadcrumbSchema, faqSchema].filter(Boolean);
}
