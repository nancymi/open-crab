import { NextRequest, NextResponse } from 'next/server';
import { collectProductHuntTools } from '@/lib/collectors/producthunt';
import { processAndDeduplicateTools } from '@/lib/processors/deduplication';

/**
 * POST /api/cron/collect-producthunt
 * Cron job to collect tools from Product Hunt
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting Product Hunt collection...');
    const results = await collectProductHuntTools();

    console.log('Processing and deduplicating...');
    const stats = await processAndDeduplicateTools(results);

    console.log(
      `Product Hunt collection complete: ${stats.created} created, ${stats.updated} updated`
    );

    return NextResponse.json({
      success: true,
      source: 'Product Hunt',
      collected: results.length,
      created: stats.created,
      updated: stats.updated,
    });
  } catch (error) {
    console.error('Error in Product Hunt cron job:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: String(error) },
      { status: 500 }
    );
  }
}
