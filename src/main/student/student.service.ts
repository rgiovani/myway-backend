import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { removeLocalFile } from '../../utils/shared/functions/defaultFunctions';
import { Repository } from 'typeorm';
import File from '../../utils/shared/entities/File.entity';
import User from '../../utils/shared/entities/User.entity';
import { managerException } from '../../utils/shared/exceptions/manager.exception';
import { encryptPassword } from '../../utils/shared/functions/hashPassword';
import { generatePayload } from '../auth/payload';
import { BaseCrudService } from '../base/base.service';
import { createFile } from '../content/defaultContentsFunctions';
import Teacher from '../teacher/Teacher.entity';
import Student from './Student.entity';

@Injectable()
export class StudentService extends BaseCrudService<Student>{
    constructor(
        @InjectRepository(Student)
        private repo: Repository<Student>,
        @InjectRepository(User)
        private repoUser: Repository<User>,
        @InjectRepository(File)
        private repoFile: Repository<File>,
        @InjectRepository(Teacher)
        private repoTeacher: Repository<Teacher>,
        private jwtService: JwtService
    ) {
        super(repo, ['enrolledCourses', 'finishedContents', 'user']);
    }

    async createStudent(user: User) {
        const userFound = await this.repoUser.findOne({ where: { email: user.email } });
        if (!userFound) {
            const passwordHash = encryptPassword(user.password);
            user.password = passwordHash;
            const newUser = this.repoUser.create(user);
            const errors = await validate(newUser);
            if (errors.length > 0) {
                throw new BadRequestException();
            }
            const { id, firstName, lastName, created_at, updated_at, email } = await this.repoUser.save(user);
            this.repo.save({ id });
            return { id, firstName, lastName, created_at, updated_at, email };
        }
        throw new UnauthorizedException('The user is already registered');
    }

    async getByEmail(email: string) {
        const user = await this.repoUser.findOne({ relations: ['student', 'teacher', 'teacher.profilePhoto'], where: { email } });
        if (user) {
            if (user.teacher) {
                const { id, firstName, lastName, email, password, teacher: { profilePhoto } } = user;
                return { id, firstName, lastName, email, password, profilePhoto, type: 'Teacher' };
            }
            if (user.student) {
                const { id, firstName, lastName, email, password } = user;
                return { id, firstName, lastName, email, password, type: 'Student' };
            }
        }
    }

    async getEnrroledCourses(reqID: string) {
        const response = await this.repo.findOne({
            relations: [
                'enrolledCourses',
                'enrolledCourses.courseImage',
                'enrolledCourses.teacher',
                'enrolledCourses.teacher.user',
                'enrolledCourses.contents',
                'finishedContents',
                'finishedContents.course',
                'user'
            ],
            where: {
                id: reqID
            }
        })
            .then(student => managerException<Student>(student, Student, reqID));
        const enrolledCourses = response.enrolledCourses.map(course => {
            let total = 0;
            response.finishedContents.map(content => {
                if(content.course.id === course.id) {
                    total++;
                    return total;
                }
            });
            const infoCourse = {
                id: course.id,
                progress: Math.round((total / course.contents.length) * 100),
                title: course.title,
                totalScore: course.totalScore,
                numberOfRatings: course.numberOfRatings,
                courseImage: course.courseImage,
                teacher: course.teacher
            };
            total = 0;
            return infoCourse;
        });
        return enrolledCourses;
    }

    async becomeTeacher(id: string, teacher: Teacher, profilePhoto) {
        const isImage = profilePhoto?.mimetype.includes('image');
        if(isImage) {
            const userResponse = await this.repoUser.findOne(id);
            const teacherResponse = await this.repoTeacher.findOne(id);
            if (teacherResponse) {
                throw new BadRequestException(`The user with id ${id} is already registered as a teacher!`);
            }
            if (userResponse) {
                const fileCreated = createFile(profilePhoto);
                const responseFile = await this.repoFile.save(fileCreated);
                await this.repoTeacher.save({
                    id: userResponse.id,
                    about: teacher.about,
                    specialty: teacher.specialty,
                    profilePhoto: responseFile,
                    donationLink: teacher.donationLink
                });
                const user: any = await this.repoUser.findOne({ relations: ['student', 'teacher', 'teacher.profilePhoto'], where: { id } });
                if(user.teacher) {
                    user.type = 'Teacher';
                    user.profilePhoto = user.teacher.profilePhoto;
                }
                const payload = generatePayload(user);
                return {
                    access_token: this.jwtService.sign(payload)
                };
            }
            managerException<User>(userResponse, User, id);
        } else {
            profilePhoto && removeLocalFile(profilePhoto?.filename);
            throw new BadRequestException('File is not image');
        }

    }

}
