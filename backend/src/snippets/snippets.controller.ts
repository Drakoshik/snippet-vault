import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import {CreateSnippetDto, SnippetQueryDto, UpdateSnippetDto} from "./snippets.contracts.dto";


@Controller('snippets')
export class SnippetsController {
    constructor(private readonly snippetsService: SnippetsService) {}

    @Post()
    create(@Body() createSnippetDto: CreateSnippetDto) {
        return this.snippetsService.create(createSnippetDto);
    }

    @Get()
    findAll(@Query() query: SnippetQueryDto) {
        return this.snippetsService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.snippetsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSnippetDto: UpdateSnippetDto) {
        return this.snippetsService.update(id, updateSnippetDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.snippetsService.remove(id);
    }
}
