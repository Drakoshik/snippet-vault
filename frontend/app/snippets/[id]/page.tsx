'use client';

import { useEffect, useState } from 'react';
import { snippetApi, Snippet } from '@/api/snippeets/api';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from "@/components/LoadingSpinner";
import SnippetForm from "@/components/SnippetForm";

export default function SnippetDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [snippet, setSnippet] = useState<Snippet | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchSnippet();
    }, [params.id]);

    const fetchSnippet = async () => {
        try {
            setLoading(true);
            const data = await snippetApi.getOne(params.id as string);
            setSnippet(data);
            setError(null);
        } catch (err) {
            setError('Failed to load snippet. It may have been deleted.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (data: any) => {
        try {
            await snippetApi.update(params.id as string, data);
            setIsEditing(false);
            await fetchSnippet();
        } catch (error) {
            console.error('Error updating snippet:', error);
            alert('Failed to update snippet. Please try again.');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this snippet?')) return;

        setIsDeleting(true);
        try {
            await snippetApi.delete(params.id as string);
            router.push('/');
            router.refresh();
        } catch (error) {
            console.error('Error deleting snippet:', error);
            alert('Failed to delete snippet. Please try again.');
            setIsDeleting(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error || !snippet) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Snippet Not Found</h2>
                <p className="text-gray-600 mb-6">{error || 'The snippet you are looking for does not exist.'}</p>
                <Link
                    href="/"
                    className="inline-block px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        );
    }

    const typeColors = {
        link: 'bg-purple-100 text-purple-800',
        note: 'bg-green-100 text-green-800',
        command: 'bg-orange-100 text-orange-800',
    };

    if (isEditing) {
        return (
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Snippet</h1>
                <SnippetForm
                    initialData={snippet}
                    onSubmit={handleUpdate}
                    isLoading={isDeleting}
                />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-gray-600 rounded-lg shadow-lg p-8">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-100 mb-2">{snippet.title}</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors[snippet.type]}`}>
              {snippet.type}
            </span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>

                {snippet.tags && snippet.tags.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-sm font-medium text-gray-300 mb-2">Tags</h2>
                        <div className="flex flex-wrap gap-2">
                            {snippet.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-sm"
                                >
                  #{tag}
                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-6">
                    <h2 className="text-sm font-medium text-gray-100 mb-2">Content</h2>
                    <div className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500">
                        {snippet.content}
                    </div>
                </div>

                <div className="text-sm text-gray-100 border-t pt-4">
                    <p>Created: {new Date(snippet.createdAt).toLocaleString()}</p>
                    <p>Updated: {new Date(snippet.updatedAt).toLocaleString()}</p>
                </div>

                <div className="mt-6">
                    <Link
                        href="/"
                        className="text-cyan-600 hover:text-cyan-800 transition-colors"
                    >
                        ← Back to all snippets
                    </Link>
                </div>
            </div>
        </div>
    );
}
