import RSS from 'rss';
import { ToolWithRelations } from '@/types/tool';

/**
 * Generate RSS feed from tools
 */
export function generateRSSFeed(
  tools: ToolWithRelations[],
  baseUrl: string = 'https://open-crab.vercel.app'
): string {
  const feed = new RSS({
    title: 'Open-Crab: Latest AI Tools',
    description: 'Aggregated updates from the latest AI tools and developments',
    feed_url: `${baseUrl}/api/rss`,
    site_url: baseUrl,
    language: 'en',
    pubDate: new Date(),
    ttl: 360, // 6 hours
  });

  for (const tool of tools) {
    feed.item({
      title: tool.title,
      description: tool.description || '',
      url: tool.url,
      guid: tool.id,
      categories: tool.category ? [tool.category.name] : [],
      author: tool.author || 'Unknown',
      date: tool.publishedAt,
      enclosure: tool.imageUrl
        ? {
            url: tool.imageUrl,
            type: 'image/jpeg',
          }
        : undefined,
      custom_elements: [
        { source: tool.sourceType },
        { stars: tool.stars || 0 },
        { upvotes: tool.upvotes || 0 },
      ],
    });
  }

  return feed.xml({ indent: true });
}
