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

    // async findAll(query: SnippetQueryDto): Promise<{
    //     items: Snippet[];
    //     total: number;
    //     page: number;
    //     limit: number;
    //     totalPages: number;
    // }> {
    //
    // }

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