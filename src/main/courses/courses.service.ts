import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import File from '../../utils/shared/entities/File.entity';
import { managerException } from '../../utils/shared/exceptions/manager.exception';
import { removeLocalFile, sortArrayOfCourse } from '../../utils/shared/functions/defaultFunctions';
import { BaseCrudService } from '../base/base.service';
import { createFile } from '../content/defaultContentsFunctions';
import Language from '../language/language.entity';
import Student from '../student/Student.entity';
// import * as dataSearch from './dataSet/dataSearch';
// import * as data from './dataSet/dataSetGenerate';
import Teacher from '../teacher/Teacher.entity';
import Course from './Course.entity';

import data = require('data-search');
let datasetCourses = [];

function findCourses(courses) {
    datasetCourses = data.dataSetGenerate({
        array: courses,
        wordSize: 2,
        nameId: 'id',
        attributes: ['title', 'subtitle', 'firstName', 'lastName', 'name', 'level']
    });
}

@Injectable()
export class CoursesService extends BaseCrudService<Course>{
    constructor(
        @InjectRepository(Course)
        private repo: Repository<Course>,
        @InjectRepository(Student)
        private repoStudent: Repository<Student>,
        @InjectRepository(Teacher)
        private repoTeacher: Repository<Teacher>,
        @InjectRepository(File)
        private repoFile: Repository<File>,
        @InjectRepository(Language)
        private repoLanguage: Repository<Language>
    ) {
        super(repo, ['teacher', 'teacher.user', 'courseImage', 'contents', 'contents.file', 'language']);
        this.gerenateDataSet(repo);
    }

    async add(idTeacher: string, reqCourse: Course, image) {
        const isImage = image?.mimetype.includes('image');
        if (isImage) {
            const teacher = await this.repoTeacher.findOne({ where: { id: idTeacher } });
            if (!teacher) {
                managerException<Teacher>(teacher, Teacher, idTeacher);
            }
            if (!image) {
                throw new BadRequestException();
            }

            const obj = {
                title: reqCourse.title,
                subtitle: reqCourse.subtitle,
                description: reqCourse.description,
                studentPrerequisites: reqCourse.studentPrerequisites,
                studentTargets: reqCourse.studentTargets,
                goals: reqCourse.goals,
                level: reqCourse.level,
                courseImage: await this.repoFile.save(createFile(image)),
                teacher: teacher,
                totalScore: 0,
                numberOfRatings: 0
            };

            const newCourse = this.repo.create(obj);
            const courseResponse = await this.repo.save(newCourse);
            const newLanguage = await this.repoLanguage.save({
                course: {
                    id: courseResponse.id
                },
                translatorAnnouncements: null,
                name: String(reqCourse.language)
            });
            courseResponse.language = [];
            courseResponse.language[0] = newLanguage;
            return courseResponse;
        } else {
            image && removeLocalFile(image?.filename);
            throw new BadRequestException('File is not image');
        }
    }

    async edit(idTeacher: string, idCourse: string, reqCourse: Course, image) {
        const isImage = image?.mimetype.includes('image');
        const teacher = await this.repoTeacher.findOne({ where: { id: idTeacher } });
        if (!teacher) {
            managerException<Teacher>(teacher, Teacher, idTeacher);
        }
        const course = await this.repo.findOne({
            where: { id: idCourse, teacher: { id: idTeacher } },
            relations: ['courseImage', 'contents', 'language']
        });
        if (!course) {
            managerException<Course>(course, Course, idCourse);
        }

        let imageCreated;
        if (image) {
            if (!isImage) {
                image && removeLocalFile(image?.filename);
                throw new BadRequestException('File is not image');
            }
            imageCreated = await this.repoFile.save(createFile(image));
            if (course.courseImage) {
                removeLocalFile(course.courseImage?.newName);
                await this.repoFile.query(`DELETE FROM file WHERE id = '${course.courseImage?.id}'`);
            }
        } else {
            imageCreated = course.courseImage;
        }
        const updatedCourse = await this.repo.save({
            id: course.id,
            title: reqCourse.title,
            subtitle: reqCourse.subtitle,
            description: reqCourse.description,
            studentPrerequisites: reqCourse.studentPrerequisites,
            studentTargets: reqCourse.studentTargets,
            goals: reqCourse.goals,
            level: reqCourse.level,
            courseImage: imageCreated,
            contents: course.contents,
            teacher: teacher,
            totalScore: course.totalScore,
            numberOfRatings: course.numberOfRatings
        });
        const newLanguage = await this.repoLanguage.save({
            id: course.language[0].id,
            course: {
                id: updatedCourse.id
            },
            translatorAnnouncements: null,
            name: String(reqCourse.language)
        });
        updatedCourse.language = [];
        updatedCourse.language[0] = newLanguage;
        return updatedCourse;
    }

    async remove(idTeacher: string, idCourse: string) {
        const teacher = await this.repoTeacher.findOne({ where: { id: idTeacher } });

        if (!teacher) {
            managerException<Teacher>(teacher, Teacher, idTeacher);
        }

        const course = await this.repo.findOne({
            where: { id: idCourse, teacher: { id: idTeacher } },
            relations: ['courseImage', 'contents', 'contents.file', 'language']

        });

        if (!course) {
            managerException<Course>(course, Course, idCourse);
        }

        if (course.contents?.length > 0) {
            course.contents.forEach(content => {
                content.file && this.repoFile.delete(content.file?.id).catch(e => console.error(e));
                content.file && removeLocalFile(content.file?.newName);
            });
        }

        if (course.courseImage) {
            removeLocalFile(course.courseImage.newName);
            this.repoFile.delete(course.courseImage.id);
        }

        this.repo.delete(idCourse).catch(e => console.error(e));
    }

    async findCoursesByLanguage(language: string): Promise<Course[]> {
        const result = await this.repo.createQueryBuilder('courses')
            .innerJoinAndSelect('courses.teacher', 'users')
            .innerJoinAndSelect('courses.courseImage', 'files')
            .innerJoinAndSelect('courses.language', 'language')
            .orWhere('language.name like :language', { language: `${language}` })
            .orderBy('courses.totalScore', 'DESC')
            .getMany();
        return result;
    }

    async findAllCoursesByField(fieldQuery: string, languageQuery: string, sort: string): Promise<Course[]> {
        const sortNumber = (sort) ? (sort.toLowerCase() === 'asc') ? 1 : -1 : -1;
        data.setSearchDistance(0.1, 0.85);
        if (languageQuery) {
            const courses = data.search(datasetCourses, fieldQuery, true, languageQuery);
            courses.result = sortArrayOfCourse(courses.result, sortNumber);
            return courses;
        }
        const courses = data.search(datasetCourses, fieldQuery, true);
        courses.result = sortArrayOfCourse(courses.result, sortNumber);
        return courses;
    }

    verifyEnrolledCoursesByStudent(student: Student, course: Course) {
        let exists = false;
        if (student && course) {
            student.enrolledCourses.forEach(enrolledCourse => {
                if (enrolledCourse.id === course.id) {
                    exists = true;
                }
            });
            return exists;
        }
    }

    async studentHasCourse(studentID: string, courseId: string): Promise<boolean> {
        try {
            const student = await this.repoStudent.findOne({ relations: ['enrolledCourses'], where: { id: studentID } })
                .then(student => managerException<Student>(student, Student, studentID));

            const course = await this.repo.findOne({ where: { id: courseId } })
                .then(course => managerException<Course>(course, Course, courseId));

            return this.verifyEnrolledCoursesByStudent(student, course);
        } catch (error) { }
    }

    async enrollStudentInTheCourse(idStudent: string, idCourse: string): Promise<any> {
        const student = await this.repoStudent.findOne({ relations: ['enrolledCourses'], where: { id: idStudent } })
            .then(student => managerException<Student>(student, Student, idStudent));

        const course = await this.repo.findOne({ where: { id: idCourse } })
            .then(course => managerException<Course>(course, Course, idCourse));

        let exists = false;
        exists = this.verifyEnrolledCoursesByStudent(student, course);

        if (!exists) {
            student.enrolledCourses.push(course);
            this.repoStudent.save(student);
            return 'UPDATED';
        } else {
            const tmpCourses = [];
            student.enrolledCourses.forEach(courseItem => {
                if (courseItem.id !== idCourse) {
                    tmpCourses.push(courseItem);
                }
            });
            student.enrolledCourses = tmpCourses;
            this.repoStudent.save(student);
            return 'DELETED';
        }
    }

    async getStudentScore(idStudent: string, idCourse: string) {
        try {
            const queryStudentCourse = `
                    SELECT * FROM student_course WHERE student_id = '${idStudent}'
                    AND course_id = '${idCourse}'
                `;
            const [response] = await this.repoStudent.query(queryStudentCourse);

            return Number(response.score);

        } catch (error) { }
    }

    async scoreCourse(idCourse: string, userScore: any, idStudent: string): Promise<any> {
        if (userScore.score > 0 && userScore.score <= 5) {
            const course = await this.repo.findOne({ relations: ['teacher'], where: { id: idCourse } })
                .then(course => managerException<Course>(course, Course, idCourse));
            if (course.teacher.id === idStudent) {
                throw new ForbiddenException(`The user id ${idStudent} cannot evaluate the course, because he who created this course`);
            }
            const queryStudentCourse = `
                SELECT sc.student_id, sc.course_id, sc.score, sc.finished, sc.isRated
                FROM student s INNER JOIN student_course sc ON s.id = sc.student_id
                WHERE s.id = '${idStudent}'
                AND sc.course_id = '${idCourse}'
            `;
            let [response] = await this.repoStudent.query(queryStudentCourse);
            if (response) {
                course.totalScore -= response.score;
                course.totalScore += userScore.score;
                if (!response.isRated) {
                    course.numberOfRatings++;
                }
                await this.repo.query(`UPDATE student_course SET isRated = true, score = ${userScore.score} WHERE student_id = '${idStudent}' AND course_id = '${idCourse}'`);
                await this.repo.update(idCourse, course);
                [response] = await this.repoStudent.query(queryStudentCourse);
                return response;
            }
            throw new ForbiddenException(`The student with the id ${idStudent} is not enrolled in the course with the id ${idCourse}`);
        }
        throw new BadRequestException('The score must be a minimum of 1 and a maximum of 5');
    }

    async gerenateDataSet(repo: Repository<Course>) {
        const coursesResponse = await repo.find({ relations: ['teacher', 'teacher.user', 'courseImage', 'language'] }).then(item => item);
        coursesResponse.forEach(course => {
            course.teacher.donationLink = '';
            course.teacher.user.password = '';
        });
        findCourses(coursesResponse);
        setInterval(async function () {
            const coursesResponse = await repo.find({ relations: ['teacher', 'teacher.user', 'courseImage', 'language'] }).then(item => item);
            coursesResponse.forEach(course => {
                course.teacher.donationLink = '';
                course.teacher.user.password = '';
            });
            findCourses(coursesResponse);
        }, 120000); // 2 min
        // data.generate(repo);
        // setInterval(function () {
        //     data.generate(repo);
        // }, 600000); //10 min
    }
}
