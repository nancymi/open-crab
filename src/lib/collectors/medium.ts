import Parser from 'rss-parser';
import { CollectorResult, MediumPost } from '@/types/tool';

const parser = new Parser();

/**
 * Collects AI-related articles from Medium
 * Parses RSS feeds from AI tags
 */
export async function collectMediumTools(): Promise<CollectorResult[]> {
  try {
    const feedUrls = [
      'https://medium.com/feed/tag/artificial-intelligence',
      'https://medium.com/feed/tag/machine-learning',
      'https://medium.com/feed/tag/chatgpt',
      'https://medium.com/feed/tag/large-language-models',
      'https://medium.com/feed/tag/ai-tools',
    ];

    const results: CollectorResult[] = [];
    const seenGuids = new Set<string>();
    const yesterday = Date.now() - 24 * 60 * 60 * 1000;

    for (const feedUrl of feedUrls) {
      try {
        const feed = await parser.parseURL(feedUrl);

        for (const item of feed.items) {
          const post = item as MediumPost & { isoDate?: string };

          // Deduplicate by GUID
          if (seenGuids.has(post.guid)) continue;
          seenGuids.add(post.guid);

          // Only include posts from the last 24 hours
          const publishedDate = new Date(post.isoDate || post.pubDate);
          if (publishedDate.getTime() < yesterday) continue;

          // Extract thumbnail from content if available
          let thumbnail: string | null = null;
          if (item.content) {
            const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch) {
              thumbnail = imgMatch[1];
            }
          }

          // Extract Medium article ID from GUID
          const guidMatch = post.guid.match(/post\/([a-f0-9]+)/);
          const sourceId = guidMatch ? guidMatch[1] : post.guid;

          results.push({
            title: post.title,
            description: post.contentSnippet || null,
            url: post.link,
            imageUrl: thumbnail,
            sourceType: 'MEDIUM',
            sourceId: sourceId,
            author: post.author || 'Unknown',
            stars: null,
            upvotes: null,
            publishedAt: publishedDate,
          });
        }

        // Rate limiting - wait between feed requests
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error parsing Medium feed ${feedUrl}:`, error);
      }
    }

    console.log(`Medium collector: Found ${results.length} articles`);
    return results;
  } catch (error) {
    console.error('Error in Medium collector:', error);
    throw error;
  }
}
