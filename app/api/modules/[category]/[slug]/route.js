import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getCachedCurriculum, getCachedUser } from '@/lib/cache';
import { findTopicBySlugs, getCategorySlug, getTopicSlug } from '@/lib/slug';
import { generateKeywords, generateOpenGraph, generateTwitter, generateTopicJsonLd, SITE_URL, SITE_NAME } from '@/lib/seo';

export const dynamic = 'force-dynamic';

async function checkUser(req) {
  const reqUserId = req.headers.get('x-user-id');
  if (!reqUserId) return null;

  const user = await getCachedUser(reqUserId);
  if (!user || !user.approved) {
    return null;
  }
  return user;
}

export async function GET(req, { params }) {
  const { category: categorySlug, slug: topicSlug } = params;
  const timerLabel = `API: GET /api/modules/${categorySlug}/${topicSlug}`;
  console.time(timerLabel);

  try {
    const user = await checkUser(req);
    if (!user || !user.can_view) {
      console.timeEnd(timerLabel);
      return NextResponse.json({ message: 'Access Denied. Insufficient permissions.' }, { status: 403 });
    }

    // Fetch curriculum from cache
    const { todos, questions, codeExamples, notes } = await getCachedCurriculum();

    // Find the specific topic by slugs
    const topic = findTopicBySlugs(todos, categorySlug, topicSlug);

    if (!topic) {
      console.timeEnd(timerLabel);
      return NextResponse.json({ message: 'Module not found.' }, { status: 404 });
    }

    // Filter questions, code examples, and notes associated with this topic
    const topicQuestions = questions
      .filter(q => q.todo_id === topic.id)
      .sort((a, b) => {
        const orderA = a.sort_order !== undefined && a.sort_order !== null ? a.sort_order : 0;
        const orderB = b.sort_order !== undefined && b.sort_order !== null ? b.sort_order : 0;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return a.id - b.id;
      });

    const topicExamples = codeExamples.filter(e => e.topic_id === topic.id);
    const topicNotes = notes.filter(n => n.topic_id === topic.id);

    // Fetch user completion tasks
    const { data: userTasks, error: tasksError } = await supabase
      .from('user_tasks')
      .select('item_type, item_id, status, saved_for_later')
      .eq('user_id', user.id);

    if (tasksError) throw tasksError;

    const taskMap = {};
    (userTasks || []).forEach(t => {
      taskMap[`${t.item_type}_${t.item_id}`] = {
        status: t.status,
        saved_for_later: t.saved_for_later
      };
    });

    const questionsWithStatus = topicQuestions.map(q => ({
      ...q,
      status: taskMap[`question_${q.id}`]?.status || 'Pending',
      saved_for_later: taskMap[`question_${q.id}`]?.saved_for_later || false
    }));

    const examplesWithStatus = topicExamples.map(e => ({
      ...e,
      status: taskMap[`code_example_${e.id}`]?.status || 'Pending',
      saved_for_later: taskMap[`code_example_${e.id}`]?.saved_for_later || false
    }));

    const notesWithStatus = topicNotes.map(n => ({
      ...n,
      status: taskMap[`note_${n.id}`]?.status || 'Pending',
      saved_for_later: taskMap[`note_${n.id}`]?.saved_for_later || false
    }));

    const isTopicCompleted = taskMap[`topic_${topic.id}`]?.status === 'Completed';
    const isTopicSaved = taskMap[`topic_${topic.id}`]?.saved_for_later || false;

    // SEO Metadata
    const catSlug = getCategorySlug(topic.category);
    const topSlug = getTopicSlug(topic.title);
    const canonicalUrl = `${SITE_URL}/${catSlug}/${topSlug}`;
    const seoTitle = `${topic.title} in ${topic.category} | ${SITE_NAME}`;
    const seoDescription = `Learn ${topic.title} (${topic.category}) with ${topicQuestions.length} practice questions, code examples, notes, and interactive solutions on CodeDiary.`;
    const keywords = generateKeywords({ ...topic, questions: topicQuestions });

    console.timeEnd(timerLabel);
    return NextResponse.json({
      ...topic,
      categorySlug: catSlug,
      topicSlug: topSlug,
      canonicalUrl,
      completed: isTopicCompleted,
      saved_for_later: isTopicSaved,
      questions: questionsWithStatus,
      codeExamples: examplesWithStatus,
      notes: notesWithStatus,
      seoMetadata: {
        title: seoTitle,
        description: seoDescription,
        keywords,
        canonicalUrl,
        openGraph: generateOpenGraph({ title: seoTitle, description: seoDescription, url: canonicalUrl, type: 'article' }),
        twitter: generateTwitter({ title: seoTitle, description: seoDescription }),
        jsonLd: generateTopicJsonLd({ ...topic, questions: topicQuestions }, topic.id)
      }
    });
  } catch (error) {
    console.error(`GET /api/modules/${categorySlug}/${topicSlug} error:`, error);
    console.timeEnd(timerLabel);
    return NextResponse.json({ message: 'Failed to retrieve module details.' }, { status: 500 });
  }
}
