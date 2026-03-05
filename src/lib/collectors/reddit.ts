import { CollectorResult, RedditPost } from '@/types/tool';

/**
 * Collects AI-related posts from Reddit
 * Monitors AI/ML subreddits using the public JSON API
 */
export async function collectRedditTools(): Promise<CollectorResult[]> {
  try {
    const subreddits = [
      'MachineLearning',
      'artificial',
      'ChatGPT',
      'LocalLLaMA',
      'ArtificialIntelligence',
    ];

    const results: CollectorResult[] = [];
    const yesterday = Date.now() / 1000 - 24 * 60 * 60;

    for (const subreddit of subreddits) {
      try {
        const response = await fetch(
          `https://www.reddit.com/r/${subreddit}/new.json?limit=50`,
          {
            headers: {
              'User-Agent': 'OpenCrab/1.0 (AI Tools Aggregator)',
            },
          }
        );

        if (!response.ok) {
          console.error(`Reddit API error for r/${subreddit}: ${response.status}`);
          continue;
        }

        const data = await response.json();
        const posts = data.data.children;

        for (const child of posts) {
          const post: RedditPost = child.data;

          // Only include posts from the last 24 hours
          if (post.created_utc < yesterday) continue;

          // Filter out low-quality posts
          if (post.score < 5) continue;

          // Skip self-posts without content
          if (!post.url || post.url.includes(`reddit.com/r/${subreddit}`)) {
            if (!post.selftext || post.selftext.length < 100) continue;
          }

          // Prefer external links over self-posts
          const url = post.url.includes('reddit.com')
            ? `https://www.reddit.com${child.data.permalink}`
            : post.url;

          results.push({
            title: post.title,
            description: post.selftext || null,
            url: url,
            imageUrl:
              post.thumbnail && post.thumbnail !== 'self' && post.thumbnail.startsWith('http')
                ? post.thumbnail
                : null,
            sourceType: 'REDDIT',
            sourceId: post.id,
            author: post.author,
            stars: null,
            upvotes: post.score,
            publishedAt: new Date(post.created_utc * 1000),
          });
        }

        // Rate limiting - wait between subreddit requests
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error fetching from r/${subreddit}:`, error);
      }
    }

    console.log(`Reddit collector: Found ${results.length} posts`);
    return results;
  } catch (error) {
    console.error('Error in Reddit collector:', error);
    throw error;
  }
}
