import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateRSSFeed } from '@/lib/utils/rss-generator';

/**
 * GET /api/rss
 * Generate RSS feed of latest AI tools
 */
export async function GET() {
  try {
    // Fetch latest 50 tools
    const tools = await prisma.tool.findMany({
      include: {
        category: true,
        tags: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 50,
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const rssXml = generateRSSFeed(tools, baseUrl);

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
