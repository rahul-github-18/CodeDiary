import { getCachedCurriculum } from '@/lib/cache';
import { findTopicBySlugs, getCategorySlug, getTopicSlug } from '@/lib/slug';
import { SITE_URL, SITE_NAME, generateKeywords, generateOpenGraph, generateTwitter, generateTopicJsonLd } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { category: categorySlug, slug: topicSlug } = params;

  try {
    const { todos, questions } = await getCachedCurriculum();
    const topic = findTopicBySlugs(todos, categorySlug, topicSlug);

    if (!topic) {
      return {
        title: 'Module Not Found',
        description: 'The requested learning module could not be found on CodeDiary.',
      };
    }

    const topicQuestions = questions?.filter(q => q.todo_id === topic.id) || [];
    const topicData = { ...topic, questions: topicQuestions };

    const catSlug = getCategorySlug(topic.category);
    const topSlug = getTopicSlug(topic.title);
    const title = `${topic.title} in ${topic.category} | ${SITE_NAME}`;
    const description = `Learn ${topic.title} (${topic.category}) with ${topicQuestions.length} practice questions, code templates, notes, and interactive solutions on CodeDiary.`;
    const keywords = generateKeywords(topicData);
    const canonical = `${SITE_URL}/${catSlug}/${topSlug}`;

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical,
      },
      openGraph: generateOpenGraph({
        title,
        description,
        url: canonical,
        type: 'article',
      }),
      twitter: generateTwitter({
        title,
        description,
      }),
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for module layout:', error);
    return {
      title: `${topicSlug} in ${categorySlug}`,
      description: 'Explore coding topics, practice questions, and notes on CodeDiary.',
    };
  }
}

export default async function ModuleLayout({ children, params }) {
  const { category: categorySlug, slug: topicSlug } = params;
  let schemas = [];

  try {
    const { todos, questions } = await getCachedCurriculum();
    const topic = findTopicBySlugs(todos, categorySlug, topicSlug);
    if (topic) {
      const topicQuestions = questions?.filter(q => q.todo_id === topic.id) || [];
      schemas = generateTopicJsonLd({ ...topic, questions: topicQuestions }, topic.id) || [];
    }
  } catch (e) {
    console.error('Error generating JSON-LD for module page:', e);
  }

  return (
    <>
      {schemas.length > 0 && (
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
          />
        </head>
      )}
      {children}
    </>
  );
}
