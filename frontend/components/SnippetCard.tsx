import Link from 'next/link';
import {Snippet} from "@/api/snippeets/contracts";

interface SnippetCardProps {
    snippet: Snippet;
}

export default function SnippetCard({ snippet }: SnippetCardProps) {
    const typeColors = {
        link: 'bg-purple-100 text-purple-800',
        note: 'bg-cyan-100 text-cyan-800',
        command: 'bg-orange-100 text-orange-800',
    };

    return (
        <Link href={`/snippets/${snippet._id}`}>
            <div className="bg-gray-600 rounded-lg shadow hover:shadow-md transition-shadow p-6 cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-100">{snippet.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[snippet.type]}`}>
            {snippet.type}
          </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{snippet.content}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                    {snippet.tags?.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
                        >
              #{tag}
            </span>
                    ))}
                </div>

                <div className="text-xs text-gray-400">
                    Updated: {new Date(snippet.updatedAt).toLocaleDateString()}
                </div>
            </div>
        </Link>
    );
}
