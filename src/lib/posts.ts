type PostLike = {
  id: string;
  data: { draft: boolean; pubDate: Date };
};

export function publicPosts<T extends PostLike>(posts: T[]): T[] {
  return posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
