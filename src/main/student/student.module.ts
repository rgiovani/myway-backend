import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Student from './Student.entity';
import Teacher from '../teacher/Teacher.entity';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import User from '../../utils/shared/entities/User.entity';
import File from '../../utils/shared/entities/File.entity';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants, expiresIn } from '../auth/constants';

@Module({
    imports: [
        TypeOrmModule.forFeature([Student, Teacher, User, File]),
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: expiresIn }
        })
    ],
    controllers: [StudentController],
    providers: [StudentService],
    exports: [StudentService]
})
export class StudentModule { }
