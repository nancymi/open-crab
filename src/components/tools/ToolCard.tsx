import Link from 'next/link';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ToolWithRelations } from '@/types/tool';

interface ToolCardProps {
  tool: ToolWithRelations;
}

export function ToolCard({ tool }: ToolCardProps) {
  const sourceColors = {
    GITHUB: 'bg-gray-800 text-white',
    REDDIT: 'bg-orange-500 text-white',
    MEDIUM: 'bg-black text-white',
    PRODUCTHUNT: 'bg-orange-600 text-white',
    HACKERNEWS: 'bg-orange-700 text-white',
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">
              <Link
                href={`/tools/${tool.slug}`}
                className="hover:text-orange-600 transition"
              >
                {tool.title}
              </Link>
            </CardTitle>
            {tool.author && (
              <CardDescription className="text-xs mt-1">by {tool.author}</CardDescription>
            )}
          </div>
          <Badge className={sourceColors[tool.sourceType]} variant="secondary">
            {tool.sourceType}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {tool.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
            {tool.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
          <div className="flex items-center gap-3">
            {tool.stars && (
              <span className="flex items-center gap-1">
                ⭐ {tool.stars}
              </span>
            )}
            {tool.upvotes && (
              <span className="flex items-center gap-1">
                ⬆️ {tool.upvotes}
              </span>
            )}
          </div>
          <span>{format(new Date(tool.publishedAt), 'MMM d, yyyy')}</span>
        </div>

        {tool.category && (
          <div className="mt-3">
            <Link href={`/categories/${tool.category.slug}`}>
              <Badge variant="outline" className="text-xs hover:bg-orange-50 transition">
                {tool.category.name}
              </Badge>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
