import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ToolGrid } from '@/components/tools/ToolGrid';
import { SearchBar } from '@/components/filters/SearchBar';
import { CategoryFilter } from '@/components/filters/CategoryFilter';
import { Button } from '@/components/ui/button';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const category = typeof params.category === 'string' ? params.category : undefined;

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

  // Fetch latest tools
  const tools = await prisma.tool.findMany({
    where,
    include: {
      category: true,
      tags: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: 12,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Discover the Latest AI Tools
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Aggregated updates from GitHub, Reddit, Medium, Product Hunt, and Hacker News.
          Stay up-to-date with the latest developments in AI.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-center">
        <SearchBar />
        <CategoryFilter />
      </div>

      {/* Tools Grid */}
      <ToolGrid tools={tools} />

      {/* View All Button */}
      <div className="text-center mt-8">
        <Link href="/tools">
          <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
            View All Tools
          </Button>
        </Link>
      </div>
    </div>
  );
}
