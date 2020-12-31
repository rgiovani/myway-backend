import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multerConfig from '../../config/multer';
import Content from './Content.entity';
import { BaseCrudController } from '../base/base.controller';
import { ContentService } from './content.service';

@Controller('contents')
export class ContentController extends BaseCrudController<Content>{
    constructor(private readonly contentService: ContentService) {
        super(contentService);
    }

    @Post('/course/:id/teacher/:idTeacher')
    @UseInterceptors(FileInterceptor('file', multerConfig))
    async addContent(@Param('idTeacher') idTeacher, @Param('id') idCourse: string, @UploadedFile() file, @Body() content: Content): Promise<Content> {
        return this.contentService.addContent(idTeacher, idCourse, file, content);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('file', multerConfig))
    async updateContent(@Param('id') idContent: string, @UploadedFile() file, @Body() content: Content): Promise<any> {
        return this.contentService.updateContent(idContent, file, content);
    }

    @Get(':id')
    async getContent(@Param('id') id: string): Promise<Content> {
        return this.contentService.findContent(id);
    }

    @Get(':id/student/:idStudent')
    async getVideoContent(@Param('id') idContent: string, @Param('idStudent') idStudent: string): Promise<Content> {
        return this.contentService.watchVideoContent(idContent, idStudent);
    }

    @Delete(':id')
    async deleteContent(@Param('id') id: string): Promise<any> {
        return this.contentService.deleteContent(id);
    }

    @Get('course/:id')
    async getAllContents(@Param('id') id: string): Promise<Content[]> {
        return this.contentService.findAllContents(id);
    }

    @Post('course/:idCourse/teacher/:idTeacher/practical')
    async createContentPractical(@Param('idCourse') idCourse: string, @Param('idTeacher') idTeacher: string, @Body() content: Content) {
        return this.contentService.createContentPractical(idCourse, idTeacher, content);
    }

    @Put(':idContent/teacher/:idTeacher/practical')
    async updateContentPractical(@Param('idContent') idContent: string, @Param('idTeacher') idTeacher: string, @Body() content: Content) {
        return this.contentService.updateContentPractical(idContent, idTeacher, content);
    }

    @Put(':idContent/student/:idStudent')
    async finishContent(@Param('idContent') idContent: string, @Param('idStudent') idStudent: string) {
        return this.contentService.finishContent(idContent, idStudent);
    }

}
