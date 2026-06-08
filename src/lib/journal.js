import fm from 'front-matter';

/**
 * Loads every markdown file in /src/journal at build time, parses
 * frontmatter, and exposes a sorted list + lookup-by-slug.
 *
 * Frontmatter shape:
 *   ---
 *   title: "Entry title"
 *   date: 2026-06-07
 *   excerpt: "One-line summary."
 *   tags: [building, ai]
 *   ---
 */
const files = import.meta.glob('../journal/*.md', { query: '?raw', import: 'default', eager: true });

function slugFromPath(path) {
  return path.split('/').pop().replace(/\.md$/, '');
}

export const entries = Object.entries(files)
  .map(([path, raw]) => {
    const { attributes, body } = fm(raw);
    return {
      slug: slugFromPath(path),
      title: attributes.title ?? slugFromPath(path),
      date: attributes.date ? new Date(attributes.date) : new Date(),
      excerpt: attributes.excerpt ?? '',
      tags: attributes.tags ?? [],
      body,
    };
  })
  .sort((a, b) => b.date - a.date);

export function getEntry(slug) {
  return entries.find((e) => e.slug === slug);
}

export function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}
