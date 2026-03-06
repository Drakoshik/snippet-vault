import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SnippetDocument = Snippet & Document;

export enum SnippetType {
    LINK = 'link',
    NOTE = 'note',
    COMMAND = 'command',
}

@Schema({ timestamps: true })
export class Snippet {
    @Prop({ required: true, index: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ type: [String], default: [], index: true })
    tags: string[];

    @Prop({ required: true, enum: SnippetType, default: SnippetType.NOTE })
    type: SnippetType;

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const SnippetSchema = SchemaFactory.createForClass(Snippet);

SnippetSchema.index({ title: 'text', content: 'text' });