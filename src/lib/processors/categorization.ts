/**
 * Auto-categorize tools based on keywords in title and description
 */

interface CategoryRule {
  slug: string;
  keywords: string[];
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    slug: 'llms-chatbots',
    keywords: [
      'gpt',
      'llm',
      'chatbot',
      'language model',
      'chat',
      'conversational',
      'assistant',
      'claude',
      'gemini',
      'mistral',
    ],
  },
  {
    slug: 'image-generation',
    keywords: [
      'image',
      'diffusion',
      'stable diffusion',
      'midjourney',
      'dall-e',
      'dalle',
      'img',
      'photo',
      'visual',
      'generation',
      'art',
    ],
  },
  {
    slug: 'code-assistants',
    keywords: [
      'code',
      'copilot',
      'programming',
      'ide',
      'developer',
      'coding',
      'github copilot',
      'cursor',
      'codebase',
    ],
  },
  {
    slug: 'data-analysis',
    keywords: [
      'data',
      'analytics',
      'visualization',
      'analysis',
      'insight',
      'dashboard',
      'metrics',
      'chart',
    ],
  },
  {
    slug: 'automation',
    keywords: [
      'automation',
      'workflow',
      'no-code',
      'zapier',
      'integration',
      'automate',
      'agent',
      'task',
    ],
  },
];

/**
 * Categorize a tool based on its title and description
 * Returns the category slug
 */
export function categorizeTool(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  // Find the first matching category
  for (const rule of CATEGORY_RULES) {
    for (const keyword of rule.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        return rule.slug;
      }
    }
  }

  // Default category
  return 'other';
}
