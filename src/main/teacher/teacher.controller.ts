import { Body, Controller, Get, Param, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multerConfig from '../../config/multer';
import { BaseCrudController } from '../base/base.controller';
import Teacher from './Teacher.entity';
import { TeacherService } from './teacher.service';

@Controller('teachers')
export class TeacherController extends BaseCrudController<Teacher>  {
    constructor(private readonly teacherService: TeacherService) {
        super(teacherService);
    }

    @Get(':id/courses')
    async getCoursesTaught(@Param('id') id: string) {
        return this.teacherService.findCoursesTaught(id);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('profilePhoto', multerConfig))
    async updateTeacher(@Param('id') id: string, @Body() teacher: Teacher, @UploadedFile() profilePhoto) {
        return this.teacherService.updateTeacher(id, teacher, profilePhoto);
    }

    @Put(':idTeacher/:idStudent/score')
    async evaluateTeacher(@Param('idTeacher') idTeacher: string, @Param('idStudent') idStudent: string, @Body() value) {
        return this.teacherService.evaluateTeacher(idTeacher, idStudent, value);
    }

    @Get(':idStudent/:idTeacher/rate')
    async getStudentScore(@Param('idStudent') idStudent: string, @Param('idTeacher') idCourse: string): Promise<number> {
        return await this.teacherService.getStudentScore(idStudent, idCourse);
    }
}
