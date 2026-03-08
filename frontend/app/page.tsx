'use client';

import { useEffect, useState } from 'react';
import { snippetApi} from '@/api/snippeets/api';
import SnippetCard from '@/components/SnippetCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import SearchBar from '@/components/SearchBar';
import {SnippetsResponse} from "@/api/snippeets/contracts";

export default function HomePage() {
  const [data, setData] = useState<SnippetsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchSnippets();
  }, [searchQuery, selectedTag, page]);

  const fetchSnippets = async () => {
    try {
      setLoading(true);
      const response = await snippetApi.getAll({
        q: searchQuery || undefined,
        tag: selectedTag || undefined,
        page,
        limit: 9,
      });
      setData(response);
      setError(null);
    } catch (err) {
      setError('Failed to load snippets. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
    setPage(1);
  };

  const allTags = data?.items.reduce((acc: string[], snippet) => {
    snippet.tags?.forEach(tag => {
      if (!acc.includes(tag)) acc.push(tag);
    });
    return acc;
  }, []) || [];

  if (loading && !data) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-600 py-12">{error}</div>;

  return (
      <div className="space-y-6">
        <SearchBar
            onSearch={handleSearch}
            initialValue={searchQuery}
        />

        {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                  <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedTag === tag
                              ? 'bg-cyan-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    #{tag}
                  </button>
              ))}
            </div>
        )}

        {data?.items.length === 0 ? (
            <EmptyState
                title="No snippets found"
                description={searchQuery || selectedTag ? "Try adjusting your search or filter" : "Get started by creating your first snippet!"}
            />
        ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.items.map((snippet) => (
                    <SnippetCard key={snippet._id} snippet={snippet} />
                ))}
              </div>

              {data && data.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2">
                Page {page} of {data.totalPages}
              </span>
                    <button
                        onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                        disabled={page === data.totalPages}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                    >
                      Next
                    </button>
                  </div>
              )}
            </>
        )}
      </div>
  );
}
