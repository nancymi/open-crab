import { prisma } from '@/lib/db';
import { CollectorResult } from '@/types/tool';
import slugify from 'slugify';
import { categorizeTool } from './categorization';

/**
 * Process and deduplicate collected tools
 * Upserts tools into database based on sourceType + sourceId
 */
export async function processAndDeduplicateTools(
  results: CollectorResult[]
): Promise<{ created: number; updated: number }> {
  let created = 0;
  let updated = 0;

  for (const result of results) {
    try {
      // Generate slug from title
      const slug = generateUniqueSlug(result.title, result.sourceId);

      // Determine category
      const categorySlug = categorizeTool(result.title, result.description || '');
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });

      // Check if tool already exists
      const existingTool = await prisma.tool.findUnique({
        where: {
          sourceType_sourceId: {
            sourceType: result.sourceType,
            sourceId: result.sourceId,
          },
        },
      });

      if (existingTool) {
        // Update existing tool (refresh metadata like stars, upvotes)
        await prisma.tool.update({
          where: { id: existingTool.id },
          data: {
            stars: result.stars,
            upvotes: result.upvotes,
            description: result.description,
            updatedAt: new Date(),
          },
        });
        updated++;
      } else {
        // Create new tool
        await prisma.tool.create({
          data: {
            title: result.title,
            slug: slug,
            description: result.description,
            url: result.url,
            imageUrl: result.imageUrl,
            sourceType: result.sourceType,
            sourceId: result.sourceId,
            author: result.author,
            stars: result.stars,
            upvotes: result.upvotes,
            publishedAt: result.publishedAt,
            categoryId: category?.id || null,
          },
        });
        created++;
      }
    } catch (error) {
      console.error(`Error processing tool "${result.title}":`, error);
    }
  }

  return { created, updated };
}

/**
 * Generate a unique slug for a tool
 */
function generateUniqueSlug(title: string, sourceId: string): string {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  // Append first 8 chars of sourceId to ensure uniqueness
  const uniqueSuffix = sourceId.substring(0, 8);
  return `${baseSlug}-${uniqueSuffix}`;
}
