import { collectGitHubTools } from '../src/lib/collectors/github';
import { collectRedditTools } from '../src/lib/collectors/reddit';
import { collectMediumTools } from '../src/lib/collectors/medium';
import { collectProductHuntTools } from '../src/lib/collectors/producthunt';
import { collectHackerNewsTools } from '../src/lib/collectors/hackernews';
import { processAndDeduplicateTools } from '../src/lib/processors/deduplication';

async function testCollectors() {
  console.log('🧪 Testing all collectors...\n');

  try {
    // Test GitHub
    console.log('1️⃣ Testing GitHub collector...');
    const githubResults = await collectGitHubTools();
    console.log(`✓ GitHub: Collected ${githubResults.length} repositories\n`);

    // Test Reddit
    console.log('2️⃣ Testing Reddit collector...');
    const redditResults = await collectRedditTools();
    console.log(`✓ Reddit: Collected ${redditResults.length} posts\n`);

    // Test Medium
    console.log('3️⃣ Testing Medium collector...');
    const mediumResults = await collectMediumTools();
    console.log(`✓ Medium: Collected ${mediumResults.length} articles\n`);

    // Test Product Hunt
    console.log('4️⃣ Testing Product Hunt collector...');
    const phResults = await collectProductHuntTools();
    console.log(`✓ Product Hunt: Collected ${phResults.length} products\n`);

    // Test Hacker News
    console.log('5️⃣ Testing Hacker News collector...');
    const hnResults = await collectHackerNewsTools();
    console.log(`✓ Hacker News: Collected ${hnResults.length} posts\n`);

    // Combine all results
    const allResults = [
      ...githubResults,
      ...redditResults,
      ...mediumResults,
      ...phResults,
      ...hnResults,
    ];

    console.log(`\n📊 Total collected: ${allResults.length} tools`);

    // Process and save to database
    console.log('\n💾 Processing and saving to database...');
    const stats = await processAndDeduplicateTools(allResults);

    console.log('\n✅ Test complete!');
    console.log(`Created: ${stats.created} new tools`);
    console.log(`Updated: ${stats.updated} existing tools`);
  } catch (error) {
    console.error('\n❌ Error during testing:', error);
    process.exit(1);
  }
}

testCollectors();
