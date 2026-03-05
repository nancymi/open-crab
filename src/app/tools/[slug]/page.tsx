import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export async function generateStaticParams() {
  const tools = await prisma.tool.findMany({
    select: { slug: true },
    take: 100, // Generate static pages for top 100 tools
  });

  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const tool = await prisma.tool.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: true,
    },
  });

  if (!tool) {
    notFound();
  }

  const sourceColors = {
    GITHUB: 'bg-gray-800 text-white',
    REDDIT: 'bg-orange-500 text-white',
    MEDIUM: 'bg-black text-white',
    PRODUCTHUNT: 'bg-orange-600 text-white',
    HACKERNEWS: 'bg-orange-700 text-white',
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/tools" className="text-sm text-gray-600 hover:text-orange-600 mb-4 inline-block">
        ← Back to all tools
      </Link>

      <Card className="mt-4">
        <CardContent className="pt-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl font-bold">{tool.title}</h1>
              <Badge className={sourceColors[tool.sourceType]} variant="secondary">
                {tool.sourceType}
              </Badge>
            </div>

            {tool.author && (
              <p className="text-gray-600 dark:text-gray-400">by {tool.author}</p>
            )}
          </div>

          {/* Description */}
          {tool.description && (
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {tool.description}
              </p>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            {tool.stars !== null && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Stars</p>
                <p className="text-xl font-semibold">⭐ {tool.stars}</p>
              </div>
            )}
            {tool.upvotes !== null && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Upvotes</p>
                <p className="text-xl font-semibold">⬆️ {tool.upvotes}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Published</p>
              <p className="text-lg font-semibold">
                {format(new Date(tool.publishedAt), 'MMM d, yyyy')}
              </p>
            </div>
            {tool.category && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                <Link href={`/categories/${tool.category.slug}`}>
                  <Badge variant="outline" className="hover:bg-orange-50 transition">
                    {tool.category.name}
                  </Badge>
                </Link>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="flex gap-4">
            <a href={tool.url} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button className="w-full bg-orange-600 hover:bg-orange-700" size="lg">
                Visit Tool →
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Related info */}
      <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        <p>
          Collected from {tool.sourceType} on{' '}
          {format(new Date(tool.collectedAt), 'MMM d, yyyy')}
        </p>
      </div>
    </div>
  );
}
