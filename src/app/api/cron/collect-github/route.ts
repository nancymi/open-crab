import { NextRequest, NextResponse } from 'next/server';
import { collectGitHubTools } from '@/lib/collectors/github';
import { processAndDeduplicateTools } from '@/lib/processors/deduplication';

/**
 * POST /api/cron/collect-github
 * Cron job to collect tools from GitHub
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting GitHub collection...');
    const results = await collectGitHubTools();

    console.log('Processing and deduplicating...');
    const stats = await processAndDeduplicateTools(results);

    console.log(`GitHub collection complete: ${stats.created} created, ${stats.updated} updated`);

    return NextResponse.json({
      success: true,
      source: 'GitHub',
      collected: results.length,
      created: stats.created,
      updated: stats.updated,
    });
  } catch (error) {
    console.error('Error in GitHub cron job:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: String(error) },
      { status: 500 }
    );
  }
}
