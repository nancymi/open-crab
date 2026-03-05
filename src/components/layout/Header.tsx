import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-orange-600">🦀</span>
            <span className="text-xl font-bold">Open-Crab</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link href="/tools" className="text-sm font-medium hover:text-orange-600 transition">
              All Tools
            </Link>
            <Link
              href="/api/rss"
              className="text-sm font-medium hover:text-orange-600 transition"
              target="_blank"
            >
              RSS Feed
            </Link>
            <a
              href="https://github.com"
              className="text-sm font-medium hover:text-orange-600 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
