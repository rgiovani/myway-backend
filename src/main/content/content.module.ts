import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Content from './Content.entity';
import Course from '../courses/Course.entity';
import File from '../../utils/shared/entities/File.entity';
import Student from '../student/Student.entity';
import Teacher from '../teacher/Teacher.entity';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';

@Module({
    imports: [TypeOrmModule.forFeature([Course, File, Content, Teacher, Student, Course])],
    controllers: [ContentController],
    providers: [ContentService]
})
export class ContentModule { }
