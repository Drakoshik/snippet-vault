'use client';

import { useForm } from 'react-hook-form';
import { CreateSnippetDto, Snippet } from '@/api/snippeets/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SnippetFormProps {
    initialData?: Snippet;
    onSubmit: (data: CreateSnippetDto) => Promise<void>;
    isLoading?: boolean;
}

export default function SnippetForm({ initialData, onSubmit, isLoading }: SnippetFormProps) {
    const router = useRouter();
    const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [tagInput, setTagInput] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<CreateSnippetDto>({
        defaultValues: {
            title: initialData?.title || '',
            content: initialData?.content || '',
            type: initialData?.type || 'note',
        },
    });

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            const newTags = [...tags, tagInput.trim()];
            setTags(newTags);
            setValue('tags', newTags);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        const newTags = tags.filter(t => t !== tagToRemove);
        setTags(newTags);
        setValue('tags', newTags);
    };

    const onFormSubmit = async (data: CreateSnippetDto) => {
        try {
            await onSubmit({ ...data, tags });
            router.push('/');
            router.refresh();
        } catch (error) {
            console.error('Error saving snippet:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 bg-gray-600 p-6 rounded-lg shadow">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                    Title *
                </label>
                <input
                    type="text"
                    id="title"
                    {...register('title', { required: 'Title is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter snippet title"
                />
                {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                    Content *
                </label>
                <textarea
                    id="content"
                    rows={5}
                    {...register('content', { required: 'Content is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter snippet content"
                />
                {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
                    Type *
                </label>
                <select
                    id="type"
                    {...register('type', { required: 'Type is required' })}
                    className="w-full px-3 py-2 border bg-gray-600 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                    <option value="note">Note</option>
                    <option value="link">Link</option>
                    <option value="command">Command</option>
                </select>
                {errors.type && (
                    <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    Tags
                </label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Add a tag and press Enter"
                    />
                    <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Add
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-cyan-800"
                        >
              {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-2 text-cyan-600 hover:text-cyan-800"
                            >
                ×
              </button>
            </span>
                    ))}
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Saving...' : initialData ? 'Update Snippet' : 'Create Snippet'}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
