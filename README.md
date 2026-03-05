# 🦀 Open-Crab: AI Tools Aggregation Platform

A Next.js application that automatically aggregates AI tool updates from multiple sources including GitHub, Reddit, Medium, Product Hunt, and Hacker News. Features intelligent categorization, search, filtering, and RSS feed generation.

## Features

- **Multi-Source Aggregation**: Collects AI tools from 5+ sources
- **Smart Categorization**: Automatic categorization using keyword matching
- **Search & Filter**: Real-time search and category filtering
- **RSS Feed**: Subscribe to latest AI tools via RSS
- **Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui
- **Automated Updates**: Scheduled cron jobs for continuous data collection

## Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Database**: PostgreSQL with Prisma ORM v7
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Deployment**: Vercel (with Vercel Postgres and Cron Jobs)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- API keys for data sources (optional but recommended)

### Installation

1. **Clone and install dependencies**

```bash
npm install
```

2. **Configure environment variables**

Copy `.env.local` and update with your credentials:

```bash
# Database (required)
DATABASE_URL="postgresql://user:password@localhost:5432/opencrab"

# GitHub API Token (required - get from https://github.com/settings/tokens)
GITHUB_TOKEN="ghp_your_token_here"

# Product Hunt API (optional)
PRODUCTHUNT_API_KEY=""

# Cron Secret (required for production)
CRON_SECRET="your-random-secret-key"
```

3. **Setup database**

```bash
# Run database migrations
npx prisma migrate dev --name init

# Seed categories
npx tsx scripts/seed-database.ts
```

4. **Run initial data collection**

```bash
npx tsx scripts/test-collectors.ts
```

This will collect tools from all sources and populate your database.

5. **Start development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
open-crab/
├── prisma/
│   └── schema.prisma              # Database schema
├── src/
│   ├── app/                       # Next.js App Router pages
│   │   ├── api/                   # API routes & cron jobs
│   │   ├── tools/                 # Tools pages
│   │   └── categories/            # Category pages
│   ├── components/                # React components
│   │   ├── ui/                    # shadcn components
│   │   ├── layout/                # Header, Footer
│   │   ├── tools/                 # Tool display components
│   │   └── filters/               # Search & filter components
│   ├── lib/
│   │   ├── collectors/            # Data collectors for each source
│   │   ├── processors/            # Data processing logic
│   │   └── utils/                 # Utility functions
│   └── types/                     # TypeScript types
├── scripts/
│   ├── seed-database.ts           # Seed categories
│   └── test-collectors.ts         # Test data collection
└── vercel.json                    # Vercel cron configuration
```

## Data Sources

### GitHub
- Searches repositories with AI-related topics
- Collects stars, description, author info
- Rate limit: 5000 requests/hour (authenticated)

### Reddit
- Monitors: r/MachineLearning, r/artificial, r/ChatGPT, r/LocalLLaMA
- Uses public JSON API (no auth required)
- Filters by upvotes and recency

### Medium
- Parses RSS feeds from AI-related tags
- Extracts articles, authors, and thumbnails
- No authentication required

### Product Hunt
- GraphQL API for AI product launches
- Requires API key (optional)
- Collects votes, taglines, and thumbnails

### Hacker News
- Algolia Search API for AI discussions
- No authentication required
- Filters by points and keywords

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma migrate dev    # Create and apply migrations
npx prisma studio         # Open Prisma Studio (DB GUI)
npx prisma generate       # Generate Prisma Client

# Data Collection
npx tsx scripts/seed-database.ts      # Seed categories
npx tsx scripts/test-collectors.ts    # Test all collectors
```

## API Endpoints

### Public APIs

- `GET /api/tools` - List tools with filters
  - Query params: `category`, `sourceType`, `search`, `limit`, `offset`
- `GET /api/rss` - RSS feed of latest tools

### Cron Jobs (Protected by CRON_SECRET)

- `POST /api/cron/collect-github` - Collect from GitHub
- `POST /api/cron/collect-reddit` - Collect from Reddit
- `POST /api/cron/collect-medium` - Collect from Medium
- `POST /api/cron/collect-producthunt` - Collect from Product Hunt

Example manual trigger:
```bash
curl -X POST http://localhost:3000/api/cron/collect-github \
  -H "Authorization: Bearer your-cron-secret"
```

## Deployment to Vercel

1. **Push to GitHub**

2. **Import to Vercel**
   - Connect your GitHub repository
   - Configure environment variables (same as `.env.local`)
   - Deploy

3. **Setup Vercel Postgres** (optional)
   - Create a Postgres database in Vercel dashboard
   - Copy `DATABASE_URL` to environment variables

4. **Run migrations**
```bash
npx prisma migrate deploy
npx tsx scripts/seed-database.ts
```

5. **Cron jobs will run automatically** based on `vercel.json` schedule

## Categories

Tools are automatically categorized into:
- **LLMs & Chatbots**: Language models, conversational AI
- **Image Generation**: Image creation and editing
- **Code Assistants**: Programming and development tools
- **Data Analysis**: Analytics and visualization
- **Automation**: Workflow automation and agents
- **Other**: Everything else

## Contributing

Contributions are welcome! Areas for improvement:
- Add more data sources (Twitter, YouTube, etc.)
- Enhance categorization with ML
- Add user authentication and favorites
- Implement email notifications
- Add trending algorithms

## License

MIT License - feel free to use this project for any purpose.

## Troubleshooting

### Database connection errors
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env.local`
- Try `npx prisma dev` to start local Prisma Postgres

### API rate limits
- GitHub: Ensure `GITHUB_TOKEN` is set
- Reddit: Add delays between requests
- Product Hunt: Get API key from their dashboard

### No tools appearing
- Run `npx tsx scripts/test-collectors.ts` to populate data
- Check console logs for collector errors
- Verify API credentials are valid

## Support

For issues and questions, please open a GitHub issue.
