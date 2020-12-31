import { Body, Controller, Get, Param, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multerConfig from '../../config/multer';
import { BaseCrudController } from '../base/base.controller';
import Teacher from '../teacher/Teacher.entity';
import Student from './Student.entity';
import { StudentService } from './student.service';

@Controller('students')
export class StudentController extends BaseCrudController<Student> {
    constructor(private readonly studentService: StudentService) {
        super(studentService);
    }

    @Get(':studentID/courses')
    async getEnrroledCourses(@Param('studentID') studentID: string) {
        return this.studentService.getEnrroledCourses(studentID);
    }

    @Put(':studentID/become-teacher')
    @UseInterceptors(FileInterceptor('profilePhoto', multerConfig))
    async becomeTeacher(@Param('studentID') studentID: string, @Body() student: Teacher, @UploadedFile() profilePhoto) {
        return this.studentService.becomeTeacher(studentID, student, profilePhoto);
    }

}
