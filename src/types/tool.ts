import { SourceType, Tool, Category, Tag } from '@prisma/client';

// Re-export Prisma types
export type { SourceType, Tool, Category, Tag };

// Tool with relations
export interface ToolWithRelations extends Tool {
  category: Category | null;
  tags: Tag[];
}

// Collector response types
export interface CollectorResult {
  title: string;
  description: string | null;
  url: string;
  imageUrl: string | null;
  sourceType: SourceType;
  sourceId: string;
  author: string | null;
  stars: number | null;
  upvotes: number | null;
  publishedAt: Date;
}

// GitHub collector response
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  topics: string[];
}

// Reddit collector response
export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  url: string;
  author: string;
  score: number;
  created_utc: number;
  thumbnail: string;
  subreddit: string;
}

// Medium collector response
export interface MediumPost {
  guid: string;
  title: string;
  contentSnippet: string;
  link: string;
  pubDate: string;
  author: string;
  thumbnail?: string;
}

// Product Hunt collector response
export interface ProductHuntPost {
  id: string;
  name: string;
  tagline: string;
  url: string;
  votesCount: number;
  createdAt: string;
  thumbnail?: {
    url: string;
  };
  user?: {
    name: string;
  };
}

// Hacker News collector response
export interface HackerNewsPost {
  objectID: string;
  title: string;
  url: string;
  author: string;
  points: number;
  created_at: string;
  story_text?: string;
}

// API filter types
export interface ToolFilters {
  category?: string;
  sourceType?: SourceType;
  search?: string;
  limit?: number;
  offset?: number;
}

// API response types
export interface ToolsResponse {
  tools: ToolWithRelations[];
  total: number;
  limit: number;
  offset: number;
}
