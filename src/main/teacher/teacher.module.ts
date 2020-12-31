import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import File from '../../utils/shared/entities/File.entity';
import User from '../../utils/shared/entities/User.entity';
import Course from '../courses/Course.entity';
import Student from '../student/Student.entity';
import Rating from './Rating.entity';
import { TeacherController } from './teacher.controller';
import Teacher from './Teacher.entity';
import { TeacherService } from './teacher.service';

@Module({
    imports: [TypeOrmModule.forFeature([Teacher, Course, Student, User, File, Rating])],
    controllers: [TeacherController],
    providers: [TeacherService]
})
export class TeacherModule { }
