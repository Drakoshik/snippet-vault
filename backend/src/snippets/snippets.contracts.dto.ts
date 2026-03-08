import {IsString, IsNotEmpty, IsArray, IsEnum, IsOptional, IsInt, Min, Max} from 'class-validator';
import {SnippetType} from "./snippet.schema";
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateSnippetDto {
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: 'Content is required' })
    content: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsEnum(SnippetType, { message: 'Type must be link, note, or command' })
    @IsNotEmpty()
    type: SnippetType;
}

export class UpdateSnippetDto extends PartialType(CreateSnippetDto) {}

export class SnippetQueryDto {
    @IsOptional()
    @IsString()
    q?: string;

    @IsOptional()
    @IsString()
    tag?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;
}