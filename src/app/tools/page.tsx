import { prisma } from '@/lib/db';
import { ToolGrid } from '@/components/tools/ToolGrid';
import { SearchBar } from '@/components/filters/SearchBar';
import { CategoryFilter } from '@/components/filters/CategoryFilter';
import { Button } from '@/components/ui/button';

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const category = typeof params.category === 'string' ? params.category : undefined;
  const offset = typeof params.offset === 'string' ? parseInt(params.offset) : 0;
  const limit = 24;

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

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Fetch tools and total count
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

  const hasMore = offset + limit < total;
  const hasPrevious = offset > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All AI Tools</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <SearchBar />
        <CategoryFilter />
      </div>

      {/* Tools Grid */}
      <ToolGrid tools={tools} />

      {/* Pagination */}
      {(hasMore || hasPrevious) && (
        <div className="flex justify-center gap-4 mt-8">
          {hasPrevious && (
            <form action="/tools" method="get">
              <input type="hidden" name="offset" value={Math.max(0, offset - limit)} />
              {search && <input type="hidden" name="search" value={search} />}
              {category && <input type="hidden" name="category" value={category} />}
              <Button type="submit" variant="outline">
                Previous
              </Button>
            </form>
          )}

          <span className="flex items-center text-sm text-gray-600">
            Showing {offset + 1} - {Math.min(offset + limit, total)} of {total}
          </span>

          {hasMore && (
            <form action="/tools" method="get">
              <input type="hidden" name="offset" value={offset + limit} />
              {search && <input type="hidden" name="search" value={search} />}
              {category && <input type="hidden" name="category" value={category} />}
              <Button type="submit" variant="outline">
                Next
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
