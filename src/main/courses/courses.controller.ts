import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import Course from './Course.entity';
import { BaseCrudController } from '../base/base.controller';
import { CoursesService } from './courses.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multerConfig from '../../config/multer';

@Controller('courses')
export class CoursesController extends BaseCrudController<Course>{
    constructor(private readonly coursesService: CoursesService) {
        super(coursesService);
    }

    @Post('add/:idTeacher')
    @UseInterceptors(FileInterceptor('image', multerConfig))
    async addCourse(@Param('idTeacher') idTeacher: string, @Body() course: Course, @UploadedFile() image): Promise<Course> {
        return this.coursesService.add(idTeacher, course, image);
    }

    @Put('edit/:idTeacher/:idCourse')
    @UseInterceptors(FileInterceptor('image', multerConfig))
    async editCourse(@Param('idTeacher') idTeacher: string, @Param('idCourse') idCourse: string, @Body() course: Course, @UploadedFile() image): Promise<Course> {
        return this.coursesService.edit(idTeacher, idCourse, course, image);
    }

    @Delete('delete/:idTeacher/:idCourse')
    async deleteCourse(@Param('idTeacher') idTeacher: string, @Param('idCourse') idCourse: string) {
        return this.coursesService.remove(idTeacher, idCourse);
    }

    @Get('verify/:idStudent/:idCourse')
    async getStudentHasCourse(@Param('idStudent') idStudent: string, @Param('idCourse') idCourse: string): Promise<boolean> {
        return await this.coursesService.studentHasCourse(idStudent, idCourse);
    }

    @Put('enroll/:idStudent/:idCourse')
    async enrollStudentInCourse(@Param('idStudent') idStudent: string, @Param('idCourse') idCourse: string): Promise<any> {
        return await this.coursesService.enrollStudentInTheCourse(idStudent, idCourse);
    }

    @Get(':language/search')
    @UseInterceptors(ClassSerializerInterceptor)
    async getCoursesByLanguage(@Param('language') languageQ: string): Promise<Course[]> {
        const res = await this.coursesService.findCoursesByLanguage(languageQ);
        if (res.length == 0) {
            throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
        }
        return res;
    }

    @Get('search')
    @UseInterceptors(ClassSerializerInterceptor)
    async getAllCoursesByField(@Query('f') f: string, @Query('l') l: string, @Query('s') s: string): Promise<Course[]> {
        const res = await this.coursesService.findAllCoursesByField(f, l, s);
        return res;
    }

    @Get(':idStudent/:idCourse/rate')
    async getStudentScore(@Param('idStudent') idStudent: string, @Param('idCourse') idCourse: string): Promise<number> {
        return await this.coursesService.getStudentScore(idStudent, idCourse);
    }

    @Put(':idCourse/student/:idStudent/score')
    async scoreCourse(@Param('idCourse') idCourse: string, @Param('idStudent') idStudent: string, @Body() userScore: any): Promise<any> {
        return this.coursesService.scoreCourse(idCourse, userScore, idStudent);
    }
}
