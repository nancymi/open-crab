import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categories = [
  {
    name: 'LLMs & Chatbots',
    slug: 'llms-chatbots',
    description: 'Large Language Models, chatbots, and conversational AI tools',
    icon: '💬',
  },
  {
    name: 'Image Generation',
    slug: 'image-generation',
    description: 'AI-powered image creation and editing tools',
    icon: '🎨',
  },
  {
    name: 'Code Assistants',
    slug: 'code-assistants',
    description: 'AI tools for coding, development, and programming',
    icon: '💻',
  },
  {
    name: 'Data Analysis',
    slug: 'data-analysis',
    description: 'AI tools for data processing, visualization, and insights',
    icon: '📊',
  },
  {
    name: 'Automation',
    slug: 'automation',
    description: 'Workflow automation and AI agents',
    icon: '⚡',
  },
  {
    name: 'Other',
    slug: 'other',
    description: 'Other AI tools and applications',
    icon: '🔧',
  },
];

async function main() {
  console.log('Starting database seed...');

  // Create categories
  console.log('Creating categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    console.log(`✓ Created/updated category: ${category.name}`);
  }

  console.log('\n✅ Database seeded successfully!');
  console.log('\nNext steps:');
  console.log('1. Run collectors to populate tools: npx tsx scripts/test-collectors.ts');
  console.log('2. Or trigger cron jobs manually via API endpoints');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
