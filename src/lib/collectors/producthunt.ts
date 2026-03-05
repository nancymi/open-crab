import { CollectorResult } from '@/types/tool';

interface ProductHuntPost {
  id: string;
  name: string;
  tagline: string;
  url: string;
  votesCount: number;
  createdAt: string;
  thumbnail?: {
    url: string;
  };
  user?: {
    name: string;
  };
}

/**
 * Collects AI tools from Product Hunt
 * Uses GraphQL API to search for AI-related products
 */
export async function collectProductHuntTools(): Promise<CollectorResult[]> {
  try {
    const apiKey = process.env.PRODUCTHUNT_API_KEY;

    if (!apiKey) {
      console.log('Product Hunt API key not configured, skipping...');
      return [];
    }

    // Product Hunt GraphQL query
    const query = `
      query {
        posts(first: 50, order: VOTES, postedAfter: "${getYesterdayISO()}") {
          edges {
            node {
              id
              name
              tagline
              url
              votesCount
              createdAt
              thumbnail {
                url
              }
              user {
                name
              }
              topics {
                edges {
                  node {
                    name
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.producthunt.com/v2/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      console.error(`Product Hunt API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const posts = data.data?.posts?.edges || [];

    const results: CollectorResult[] = [];

    for (const edge of posts) {
      const post: ProductHuntPost & { topics?: { edges: Array<{ node: { name: string } }> } } =
        edge.node;

      // Filter for AI-related topics
      const topics =
        post.topics?.edges.map((t: { node: { name: string } }) => t.node.name.toLowerCase()) || [];
      const isAIRelated =
        topics.some(
          (topic: string) =>
            topic.includes('ai') ||
            topic.includes('artificial intelligence') ||
            topic.includes('machine learning') ||
            topic.includes('chatbot') ||
            topic.includes('gpt') ||
            topic.includes('automation')
        ) ||
        post.name.toLowerCase().includes('ai') ||
        post.tagline.toLowerCase().includes('ai');

      if (!isAIRelated) continue;

      // Filter by minimum votes
      if (post.votesCount < 10) continue;

      results.push({
        title: post.name,
        description: post.tagline,
        url: post.url,
        imageUrl: post.thumbnail?.url || null,
        sourceType: 'PRODUCTHUNT',
        sourceId: post.id,
        author: post.user?.name || null,
        stars: null,
        upvotes: post.votesCount,
        publishedAt: new Date(post.createdAt),
      });
    }

    console.log(`Product Hunt collector: Found ${results.length} products`);
    return results;
  } catch (error) {
    console.error('Error in Product Hunt collector:', error);
    return [];
  }
}

function getYesterdayISO(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString();
}
