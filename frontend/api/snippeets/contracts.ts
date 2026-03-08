
export interface Snippet {
    _id: string;
    title: string;
    content: string;
    tags: string[];
    type: 'link' | 'note' | 'command';
    createdAt: string;
    updatedAt: string;
}

export interface SnippetsResponse {
    items: Snippet[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface CreateSnippetDto {
    title: string;
    content: string;
    tags?: string[];
    type: 'link' | 'note' | 'command';
}

export interface UpdateSnippetDto extends Partial<CreateSnippetDto> {}

export interface SnippetQuery {
    q?: string;
    tag?: string;
    page?: number;
    limit?: number;
}
