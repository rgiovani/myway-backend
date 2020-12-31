import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { removeLocalFile } from '../../utils/shared/functions/defaultFunctions';
import { Repository } from 'typeorm';
import File from '../../utils/shared/entities/File.entity';
import User from '../../utils/shared/entities/User.entity';
import { managerException } from '../../utils/shared/exceptions/manager.exception';
import { BaseCrudService } from '../base/base.service';
import { createFile } from '../content/defaultContentsFunctions';
import Course from '../courses/Course.entity';
import Student from '../student/Student.entity';
import Rating from './Rating.entity';
import Teacher from './Teacher.entity';

@Injectable()
export class TeacherService extends BaseCrudService<Teacher>{
    constructor(
        @InjectRepository(Teacher)
        private repo: Repository<Teacher>,
        @InjectRepository(Course)
        private repoCourse: Repository<Course>,
        @InjectRepository(Student)
        private repoStudent: Repository<Student>,
        @InjectRepository(User)
        private repoUser: Repository<User>,
        @InjectRepository(File)
        private repoFile: Repository<File>,
        @InjectRepository(Rating)
        private repoRating: Repository<Rating>
    ) {
        super(repo, ['coursesTaught', 'coursesTaught.teacher', 'user', 'profilePhoto', 'rating']);
    }

    async findCoursesTaught(id: string) {
        const courses = await this.repoCourse.find({
            select: [
                'id',
                'courseImage',
                'title',
                'level',
                'totalScore',
                'numberOfRatings'
            ],
            relations: ['courseImage', 'teacher', 'teacher.user', 'language'],
            where: { teacher: { id: id } }
        });
        const students = await this.repoStudent.find({ relations: ['enrolledCourses'] });
        let totalStudents = 0;

        const coursesTaught = [];
        let averageCoursesTaught = 0;
        let numberOfRatingsTotal = 0;
        if (courses) {
            courses.forEach((course, index) => {
                coursesTaught.push({
                    id: course.id,
                    average: course.totalScore / course.numberOfRatings,
                    numberOfRatings: course.numberOfRatings,
                    title: course.title,
                    level: course.level.toString(),
                    language: course.language,
                    courseImage: course.courseImage.link,
                    totalStudents: 0
                });
                students.forEach(student => {
                    student.enrolledCourses.forEach(enrolledCourse => {
                        if (enrolledCourse.id == course.id) {
                            totalStudents++;
                            coursesTaught[index].totalStudents = totalStudents;
                        }
                    });
                });
                numberOfRatingsTotal += course.numberOfRatings;
                averageCoursesTaught += course.totalScore;
                totalStudents = 0;
            });
            averageCoursesTaught /= numberOfRatingsTotal;
            averageCoursesTaught = Number(averageCoursesTaught.toFixed(1));
            return { averageCoursesTaught, coursesTaught };
        }
    }

    async updateTeacher(id: string, teacher: Teacher, profilePhoto) {
        const teacherResponse = await this.repo.findOne(id, { relations: ['profilePhoto', 'user'] });
        const coursesResponse = await this.repoCourse.find({ relations: ['teacher'], where: { teacher: id } });
        if (teacherResponse) {
            const { firstName, lastName, email, specialty, about }: any = teacher;
            if (!firstName || !lastName || !email || !specialty || !about) {
                throw new BadRequestException('The firstName, lastName, email, specialty and about fields must be filled');
            }

            let imageCreated;
            if(profilePhoto) {
                imageCreated = await this.repoFile.save(createFile(profilePhoto));
                if (teacherResponse.profilePhoto) {
                    removeLocalFile(teacherResponse.profilePhoto?.newName);
                    await this.repoFile.query(`DELETE FROM file WHERE id = '${teacher.profilePhoto?.id}'`);
                }
                const fileCreated = createFile(profilePhoto);
                imageCreated = await this.repoFile.save(fileCreated);
            } else {
                imageCreated = teacherResponse.profilePhoto;
            }
            await this.repoUser.update(id, { firstName, lastName, email });
   
            teacher.coursesTaught = coursesResponse;
            await this.repo.update(id, { about, specialty, profilePhoto: imageCreated, donationLink: teacher.donationLink });
            const teacherUpdated = await this.repo.findOne(id, { relations: ['profilePhoto', 'user'] });
            return teacherUpdated;
        }
        managerException<Teacher>(teacherResponse, Teacher, id);
    }

    async evaluateTeacher(idTeacher: string, idStudent: string, body) {
        const value = body.value;
        if (value > 0 && value <= 5) {
            const teacher = await this.repo.findOne({ relations: ['user', 'profilePhoto', 'rating'], where: { id: idTeacher } })
                .then(teacher => managerException<Teacher>(teacher, Teacher, idTeacher));
            await this.repoStudent.findOne({ relations: ['user'], where: { id: idStudent } })
                .then(student => managerException<Student>(student, Student, idStudent));
            if (teacher.user.id == idStudent) {
                throw new ForbiddenException(`The student with the id ${idStudent} cannot evaluate himself as a teacher. `);
            }
            const queryStudentTeacher = ` 
                SELECT rt.isRated, rt.score, rt.student_id, rt.teacher_id
                FROM student s INNER JOIN rate_teacher rt ON s.id = rt.student_id
                WHERE s.id = '${idStudent}'
                AND rt.teacher_id = '${idTeacher}'
            `;

            let [response] = await this.repoStudent.query(queryStudentTeacher);
            if (response) {                                                             //edit score
                teacher.rating.totalScore -= response.score;
                teacher.rating.totalScore += value;
                await this.repo.query(`UPDATE rate_teacher SET isRated = true, score = ${value} 
                WHERE student_id = '${idStudent}' AND teacher_id = '${idTeacher}'`);

                await this.repoRating.update(teacher.rating.id, teacher.rating);
                await this.repo.save(teacher);

            } else {                                                                    //new score
                teacher.rating.numberOfRatings++;
                teacher.rating.totalScore += value;
                await this.repo.query(`INSERT INTO rate_teacher 
                VALUES (true, ${value}, '${idStudent}', '${idTeacher}')
                `);

                await this.repoRating.update(teacher.rating.id, teacher.rating);
                await this.repo.save(teacher);
            }

            [response] = await this.repoStudent.query(queryStudentTeacher);
            return response;
        }
        throw new BadRequestException('The score must be a minimum of 1 and a maximum of 5');
    }

    async getStudentScore(idStudent: string, idTeacher: string) {
        try {
            const queryStudentTeacher = `
            SELECT * FROM rate_teacher WHERE student_id = '${idStudent}'
            AND teacher_id = '${idTeacher}'
        `;
            const [response] = await this.repo.query(queryStudentTeacher);
            return Number(response.score);
        } catch (error) { }

    }

}
