/**
 * Utility functions for URL slugs and SEO route generation
 */

export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // Separate accent marks
    .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
    .replace(/\s+/g, '-') // Collapse whitespace and replace by -
    .replace(/-+/g, '-') // Collapse dashes
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export function getCategorySlug(category) {
  const cat = category || 'general';
  return slugify(cat) || 'general';
}

export function getTopicSlug(title) {
  const t = title || 'topic';
  return slugify(t) || 'topic';
}

export function getTopicUrl(topic) {
  if (!topic) return '/';
  const categorySlug = getCategorySlug(topic.category);
  const topicSlug = getTopicSlug(topic.title);
  if (!topicSlug) return `/todo/${topic.id}`;
  return `/${categorySlug}/${topicSlug}`;
}

export function findTopicBySlugs(todos = [], categorySlug, topicSlug) {
  if (!todos || !Array.isArray(todos) || todos.length === 0) return null;

  const targetCategorySlug = slugify(categorySlug);
  const targetTopicSlug = slugify(topicSlug);

  // 1. Try exact slug match on both category and topic title
  let match = todos.find(t => 
    getCategorySlug(t.category) === targetCategorySlug && 
    getTopicSlug(t.title) === targetTopicSlug
  );

  if (match) return match;

  // 2. Try matching by topic slug alone
  match = todos.find(t => getTopicSlug(t.title) === targetTopicSlug);
  if (match) return match;

  // 3. Singular / Plural / Normalized matching (e.g. 'graph' <-> 'graphs', 'tree' <-> 'trees')
  const normalize = (str) => slugify(str).replace(/s$/, '');
  const normTargetCategory = normalize(categorySlug);
  const normTargetTopic = normalize(topicSlug);

  match = todos.find(t => {
    const catNorm = normalize(t.category);
    const topNorm = normalize(t.title);
    return (catNorm === normTargetCategory || !targetCategorySlug) && topNorm === normTargetTopic;
  });
  if (match) return match;

  // 4. Topic title singular/plural fallback anywhere
  match = todos.find(t => normalize(t.title) === normTargetTopic);
  if (match) return match;

  // 5. Fallback: Check if topicSlug is numeric ID
  const numericId = parseInt(topicSlug, 10);
  if (!isNaN(numericId)) {
    match = todos.find(t => t.id === numericId);
  }

  return match || null;
}
