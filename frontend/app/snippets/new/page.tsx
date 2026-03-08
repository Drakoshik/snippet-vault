'use client';

import { snippetApi } from '@/api/snippeets/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SnippetForm from "@/components/SnippetForm";

export default function NewSnippetPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            await snippetApi.create(data);
            router.push('/');
            router.refresh();
        } catch (error) {
            console.error('Error creating snippet:', error);
            alert('Failed to create snippet. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-300 mb-6">Create New Snippet</h1>
            <SnippetForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
    );
}
