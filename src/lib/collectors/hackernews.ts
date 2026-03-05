import { CollectorResult, HackerNewsPost } from '@/types/tool';

/**
 * Collects AI-related posts from Hacker News
 * Uses Algolia Search API to find recent AI discussions
 */
export async function collectHackerNewsTools(): Promise<CollectorResult[]> {
  try {
    const keywords = [
      'AI tool',
      'LLM',
      'ChatGPT',
      'machine learning',
      'artificial intelligence',
      'GPT',
    ];

    const results: CollectorResult[] = [];
    const seenIds = new Set<string>();
    const yesterday = Math.floor(Date.now() / 1000) - 24 * 60 * 60;

    for (const keyword of keywords) {
      try {
        const response = await fetch(
          `http://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(
            keyword
          )}&tags=story&numericFilters=created_at_i>${yesterday}&hitsPerPage=20`
        );

        if (!response.ok) {
          console.error(`Hacker News API error for "${keyword}": ${response.status}`);
          continue;
        }

        const data = await response.json();
        const hits = data.hits || [];

        for (const hit of hits) {
          const post: HackerNewsPost = hit;

          // Deduplicate
          if (seenIds.has(post.objectID)) continue;
          seenIds.add(post.objectID);

          // Filter by minimum points
          if (post.points < 10) continue;

          // Skip posts without URLs
          if (!post.url) continue;

          results.push({
            title: post.title,
            description: post.story_text || null,
            url: post.url,
            imageUrl: null,
            sourceType: 'HACKERNEWS',
            sourceId: post.objectID,
            author: post.author,
            stars: null,
            upvotes: post.points,
            publishedAt: new Date(post.created_at),
          });
        }

        // Rate limiting - wait between searches
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error searching Hacker News for "${keyword}":`, error);
      }
    }

    console.log(`Hacker News collector: Found ${results.length} posts`);
    return results;
  } catch (error) {
    console.error('Error in Hacker News collector:', error);
    throw error;
  }
}
