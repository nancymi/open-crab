import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ToolGrid } from '@/components/tools/ToolGrid';

export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({
      select: { slug: true },
    });

    return categories.map((category) => ({
      category: category.slug,
    }));
  } catch (error) {
    // During initial build, database may not be available yet
    // Return empty array to skip static generation
    console.log('Database not available during build, skipping static generation');
    return [];
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) {
    notFound();
  }

  const tools = await prisma.tool.findMany({
    where: {
      categoryId: category.id,
    },
    include: {
      category: true,
      tags: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: 50,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 dark:text-gray-400">{category.description}</p>
        )}
      </div>

      <ToolGrid tools={tools} />
    </div>
  );
}
