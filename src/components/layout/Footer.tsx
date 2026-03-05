import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-3 flex items-center space-x-2">
              <span className="text-xl">🦀</span>
              <span>Open-Crab</span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Aggregating the latest AI tools and developments from across the web.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/categories/llms-chatbots"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-600"
                >
                  LLMs & Chatbots
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/image-generation"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-600"
                >
                  Image Generation
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/code-assistants"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-600"
                >
                  Code Assistants
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/api/rss"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-600"
                >
                  RSS Feed
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-gray-600 dark:text-gray-400 hover:text-orange-600">
                  All Tools
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Sources</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Data collected from GitHub, Reddit, Medium, Product Hunt, and Hacker News.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Open-Crab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
