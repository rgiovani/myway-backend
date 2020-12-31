import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Student from '../student/Student.entity';
import Content from '../content/Content.entity';
import Course from './Course.entity';
import File from '../../utils/shared/entities/File.entity';
import Teacher from '../teacher/Teacher.entity';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import Language from '../language/language.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Course, File, Content, Teacher, Student, Language])],
    controllers: [CoursesController],
    providers: [CoursesService]
})
export class CoursesModule { }
