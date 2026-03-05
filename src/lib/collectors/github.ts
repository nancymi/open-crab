import { Octokit } from '@octokit/rest';
import { CollectorResult, GitHubRepo } from '@/types/tool';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

/**
 * Collects AI-related repositories from GitHub
 * Searches for repos with AI topics created or updated in the last 24 hours
 */
export async function collectGitHubTools(): Promise<CollectorResult[]> {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateString = yesterday.toISOString().split('T')[0];

    // Search for repositories with AI-related topics
    const queries = [
      `topic:artificial-intelligence created:>=${dateString}`,
      `topic:machine-learning created:>=${dateString}`,
      `topic:ai created:>=${dateString}`,
      `topic:llm created:>=${dateString}`,
      `topic:chatbot created:>=${dateString}`,
      `topic:gpt created:>=${dateString}`,
    ];

    const results: CollectorResult[] = [];
    const seenIds = new Set<number>();

    for (const query of queries) {
      try {
        const response = await octokit.rest.search.repos({
          q: query,
          sort: 'stars',
          order: 'desc',
          per_page: 20,
        });

        for (const repo of response.data.items as GitHubRepo[]) {
          // Deduplicate results
          if (seenIds.has(repo.id)) continue;
          seenIds.add(repo.id);

          // Filter repos with minimum stars (quality filter)
          if (repo.stargazers_count < 5) continue;

          results.push({
            title: repo.full_name,
            description: repo.description,
            url: repo.html_url,
            imageUrl: repo.owner.avatar_url,
            sourceType: 'GITHUB',
            sourceId: String(repo.id),
            author: repo.owner.login,
            stars: repo.stargazers_count,
            upvotes: null,
            publishedAt: new Date(repo.created_at),
          });
        }

        // Rate limiting - wait between queries
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error searching GitHub with query "${query}":`, error);
      }
    }

    console.log(`GitHub collector: Found ${results.length} repositories`);
    return results;
  } catch (error) {
    console.error('Error in GitHub collector:', error);
    throw error;
  }
}
