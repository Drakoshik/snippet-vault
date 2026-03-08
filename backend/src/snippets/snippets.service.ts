import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Snippet, SnippetDocument } from './snippet.schema';
import {CreateSnippetDto, SnippetQueryDto, UpdateSnippetDto} from "./snippets.contracts.dto";

@Injectable()
export class SnippetsService {
    constructor(
        @InjectModel(Snippet.name) private snippetModel: Model<SnippetDocument>,
    ) {}

    async create(createSnippetDto: CreateSnippetDto): Promise<Snippet> {
        const created = new this.snippetModel(createSnippetDto);
        return created.save();
    }

    async findAll(query: SnippetQueryDto): Promise<{
        items: Snippet[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        const { q, tag, page = 1, limit = 10 } = query;

        const currentPage = Math.max(1, Number(page) || 1);
        const currentLimit = Math.min(100, Math.max(1, Number(limit) || 10));
        const skip = (currentPage - 1) * currentLimit;

        const pipeline: any[] = [];

        const matchStage: any = {};

        if (q?.trim()) {
            matchStage.$text = { $search: q.trim() };
        }

        if (tag?.trim()) {
            matchStage.tags = tag.trim();
        }

        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        pipeline.push({ $sort: { createdAt: -1 } });

        pipeline.push({
            $facet: {
                metadata: [{ $count: "total" }],
                items: [
                    { $skip: skip },
                    { $limit: currentLimit }
                ]
            }
        });

        const result = await this.snippetModel.aggregate(pipeline).exec();

        const metadata = result[0]?.metadata[0] || { total: 0 };
        const items = result[0]?.items || [];
        const total = metadata.total;

        return {
            items,
            total,
            page: currentPage,
            limit: currentLimit,
            totalPages: Math.ceil(total / currentLimit),
        };
    }

    async findOne(id: string): Promise<Snippet> {
        const snippet = await this.snippetModel.findById(id).exec();
        if (!snippet) {
            throw new NotFoundException(`Snippet with ID ${id} not found`);
        }
        return snippet;
    }

    async update(id: string, updateSnippetDto: UpdateSnippetDto): Promise<Snippet> {
        const updated = await this.snippetModel
            .findByIdAndUpdate(id, updateSnippetDto, { new: true, runValidators: true })
            .exec();

        if (!updated) {
            throw new NotFoundException(`Snippet with ID ${id} not found`);
        }
        return updated;
    }

    async remove(id: string): Promise<void> {
        const result = await this.snippetModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Snippet with ID ${id} not found`);
        }
    }
}
