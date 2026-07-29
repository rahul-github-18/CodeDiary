import { headers } from 'next/headers';
import { getCachedCurriculum } from '@/lib/cache';
import { getCategorySlug, getTopicSlug } from '@/lib/slug';
import { getSiteUrl, SITE_NAME, generateKeywords, generateOpenGraph, generateTwitter, generateTopicJsonLd } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { id } = params;
  const topicId = parseInt(id, 10);
  const headersList = headers();
  const siteUrl = getSiteUrl(headersList);

  try {
    const { todos, questions } = await getCachedCurriculum();
    const topic = todos?.find(t => t.id === topicId);

    if (!topic) {
      return {
        title: 'Topic Not Found',
        description: 'The requested coding topic could not be found on CodeDiary.',
      };
    }

    const topicQuestions = questions?.filter(q => q.todo_id === topicId) || [];
    const topicData = { ...topic, questions: topicQuestions };

    const catSlug = getCategorySlug(topic.category);
    const topSlug = getTopicSlug(topic.title);
    const canonical = (catSlug && topSlug) ? `${siteUrl}/${catSlug}/${topSlug}` : `${siteUrl}/todo/${id}`;

    const title = `${topic.title} in ${topic.category} | ${SITE_NAME}`;
    const description = `Learn ${topic.title} (${topic.category}) with ${topicQuestions.length} practice questions, code templates, notes, and interactive solutions on CodeDiary.`;
    const keywords = generateKeywords(topicData);

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
        siteUrl,
      }),
      twitter: generateTwitter({
        title,
        description,
        siteUrl,
      }),
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    console.error('Error generating metadata for topic layout:', error);
    return {
      title: `Topic ${id}`,
      description: 'Explore coding topics, practice questions, and notes on CodeDiary.',
    };
  }
}

export default async function TodoLayout({ children, params }) {
  const { id } = params;
  const topicId = parseInt(id, 10);
  const headersList = headers();
  const siteUrl = getSiteUrl(headersList);
  let schemas = [];

  try {
    const { todos, questions } = await getCachedCurriculum();
    const topic = todos?.find(t => t.id === topicId);
    if (topic) {
      const topicQuestions = questions?.filter(q => q.todo_id === topicId) || [];
      schemas = generateTopicJsonLd({ ...topic, questions: topicQuestions }, topicId, siteUrl) || [];
    }
  } catch (e) {
    console.error('Error generating JSON-LD for topic page:', e);
  }

  return (
    <>
      {schemas.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
        />
      )}
      {children}
    </>
  );
}
