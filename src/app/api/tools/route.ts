import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { SourceType } from '@prisma/client';
import { ToolsResponse } from '@/types/tool';

/**
 * GET /api/tools
 * Retrieve tools with optional filters
 * Query params: category, sourceType, search, limit, offset
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const category = searchParams.get('category');
    const sourceType = searchParams.get('sourceType') as SourceType | null;
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: any = {};

    if (category) {
      const categoryRecord = await prisma.category.findUnique({
        where: { slug: category },
      });
      if (categoryRecord) {
        where.categoryId = categoryRecord.id;
      }
    }

    if (sourceType && Object.values(SourceType).includes(sourceType)) {
      where.sourceType = sourceType;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch tools with relations
    const [tools, total] = await Promise.all([
      prisma.tool.findMany({
        where,
        include: {
          category: true,
          tags: true,
        },
        orderBy: {
          publishedAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.tool.count({ where }),
    ]);

    const response: ToolsResponse = {
      tools,
      total,
      limit,
      offset,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
