import api from '../client';
import {CreateSnippetDto, Snippet, SnippetQuery, SnippetsResponse, UpdateSnippetDto} from "@/api/snippeets/contracts";

export const snippetApi = {
    getAll: (params?: SnippetQuery): Promise<SnippetsResponse> => {
        return api.get<SnippetsResponse>('/snippets', { params });
    },

    getOne: (id: string): Promise<Snippet> => {
        return api.get<Snippet>(`/snippets/${id}`);
    },

    create: (dto: CreateSnippetDto): Promise<Snippet> => {
        return api.post<Snippet>('/snippets', dto);
    },

    update: (id: string, dto: UpdateSnippetDto): Promise<Snippet> => {
        return api.patch<Snippet>(`/snippets/${id}`, dto);
    },

    delete: (id: string): Promise<void> => {
        return api.delete<void>(`/snippets/${id}`);
    },
};
