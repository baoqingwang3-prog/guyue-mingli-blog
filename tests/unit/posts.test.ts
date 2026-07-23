import { describe, expect, it } from 'vitest';
import { publicPosts } from '../../src/lib/posts';

describe('publicPosts', () => {
  it('excludes drafts and sorts newest first', () => {
    const result = publicPosts([
      { id: 'old', data: { draft: false, pubDate: new Date('2026-01-01') } },
      { id: 'draft', data: { draft: true, pubDate: new Date('2026-03-01') } },
      { id: 'new', data: { draft: false, pubDate: new Date('2026-02-01') } },
    ]);

    expect(result.map((post) => post.id)).toEqual(['new', 'old']);
  });
});
