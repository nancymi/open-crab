'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categories = [
  { slug: '', name: 'All Categories' },
  { slug: 'llms-chatbots', name: 'LLMs & Chatbots' },
  { slug: 'image-generation', name: 'Image Generation' },
  { slug: 'code-assistants', name: 'Code Assistants' },
  { slug: 'data-analysis', name: 'Data Analysis' },
  { slug: 'automation', name: 'Automation' },
  { slug: 'other', name: 'Other' },
];

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '';

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set('category', value);
    } else {
      params.delete('category');
    }

    // Reset offset when filtering
    params.delete('offset');

    router.push(`?${params.toString()}`);
  };

  return (
    <Select value={currentCategory} onValueChange={handleCategoryChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.slug} value={category.slug}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
