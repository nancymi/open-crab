import { NextRequest, NextResponse } from 'next/server';
import { collectMediumTools } from '@/lib/collectors/medium';
import { processAndDeduplicateTools } from '@/lib/processors/deduplication';

/**
 * POST /api/cron/collect-medium
 * Cron job to collect tools from Medium
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting Medium collection...');
    const results = await collectMediumTools();

    console.log('Processing and deduplicating...');
    const stats = await processAndDeduplicateTools(results);

    console.log(`Medium collection complete: ${stats.created} created, ${stats.updated} updated`);

    return NextResponse.json({
      success: true,
      source: 'Medium',
      collected: results.length,
      created: stats.created,
      updated: stats.updated,
    });
  } catch (error) {
    console.error('Error in Medium cron job:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: String(error) },
      { status: 500 }
    );
  }
}
