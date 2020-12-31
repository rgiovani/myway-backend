import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { removeLocalFile } from '../../utils/shared/functions/defaultFunctions';
import { Repository } from 'typeorm';
import File from '../../utils/shared/entities/File.entity';
import { managerException } from '../../utils/shared/exceptions/manager.exception';
import { BaseCrudService } from '../base/base.service';
import Course from '../courses/Course.entity';
import Student from '../student/Student.entity';
import Teacher from '../teacher/Teacher.entity';
import Content from './Content.entity';
import { createContent, createFile } from './defaultContentsFunctions';

@Injectable()
export class ContentService extends BaseCrudService<Content>{
    constructor(
        @InjectRepository(Content)
        private repoContent: Repository<Content>,
        @InjectRepository(File)
        private repoFileContent: Repository<File>,
        @InjectRepository(Teacher)
        private repoTeacher: Repository<Teacher>,
        @InjectRepository(Student)
        private repoStudent: Repository<Student>,
        @InjectRepository(Course)
        private repoCourse: Repository<Course>
    ) {
        super(repoContent, ['teacher', 'courseImage', 'contents', 'contents.file']);
    }

    async addContent(idTeacher: string, idCourse: string, file, content: Content): Promise<Content> {
        const isVideo = file?.mimetype.includes('video');
        if(isVideo) {
            const teacher = await this.repoTeacher.findOne({ where: { id: idTeacher } });
            if (!teacher) {
                throw new ForbiddenException();
            }
            const newFile = createFile(file);
            const fileCreated = await this.repoFileContent.save(newFile);
            const newContent = createContent(content, fileCreated, idCourse);
            return this.repoContent.save(newContent);
        } else {
            removeLocalFile(file?.filename);
            throw new BadRequestException('File is not video');
        }
    }

    async updateContent(idContent: string, file, content: Content): Promise<any> {
        const isVideo = file?.mimetype.includes('video');
        const response = await this.repoContent.findOne({ relations: ['file'], where: { id: idContent } })
            .then(content => managerException<Content>(content, Content, idContent));
        let contentInstance;
        if(file) {
            if(!isVideo) {
                file && removeLocalFile(file?.filename);
                throw new BadRequestException('File is not video');
            }
            const fileInstance = createFile(file);
            const fileCreated = await this.repoFileContent.save(fileInstance);
            content.file = fileCreated;
            contentInstance = Content.create(content);
            this.repoContent.update(idContent, contentInstance);
            if (response) {
                removeLocalFile(response.file?.newName);
            }
        } else {
            content.file = response.file;
            contentInstance = Content.create(content);
            this.repoContent.update(idContent, contentInstance);
        }
    }

    async findContent(id: string) {
        const response = await this.repoContent.findOne({ relations: ['file'], where: { id: id } })
            .then(content => managerException<Content>(content, Content, id));
        return response;
    }

    async watchVideoContent(idContent: string, idStudent: string): Promise<Content> {
        const student = await this.repoStudent.findOne({ relations: ['enrolledCourses'], where: { id: idStudent } })
            .then(student => managerException<Student>(student, Student, idStudent));

        const content = await this.repoContent.findOne({ relations: ['course', 'file'], where: { id: idContent } })
            .then(content => managerException<Content>(content, Content, idContent));

        const isEnrolled = student.enrolledCourses.some(enrolled => enrolled.id === content.course.id);
        if (!isEnrolled) {
            throw new ForbiddenException();
        }
        return content;
    }

    async deleteContent(id: string): Promise<any> {
        const response = await this.repoContent.findOne({ relations: ['file'], where: { id: id } })
            .then(content => managerException<Content>(content, Content, id));
        if (response) {
            if(response.file) {
               removeLocalFile(response.file?.newName);
            }
            return await this.repoContent.delete(id);
        }
    }

    async findAllContents(id: string): Promise<Content[]> {
        const response = await this.repoContent.find({ relations: ['file'], where: { course: { id: id } } });
        return response;
    }

    async createContentPractical(idCourse: string, idTeacher: string, content: Content) {
        const courseResponse = await this.repoCourse.findOne({ relations: ['teacher'], where: { id: idCourse } });
        if (!courseResponse) {
            managerException<Course>(courseResponse, Course, idCourse);
        }
        if (idTeacher !== courseResponse?.teacher.id) {
            throw new UnauthorizedException(`This course does not belong to the id teacher ${idTeacher}`);
        }
        if (!content.title || !content.course || !content.contentType || !content.description) {
            throw new BadRequestException('The content type, title, course and description fields cannot be empty');
        }
        const contentCreated = await this.repoContent.save(content);
        return contentCreated;
    }

    async updateContentPractical(idContent: string, idTeacher: string, content: Content) {
        const contentResponse = await this.repoContent.findOne(idContent);
        const teacherResponse = await this.repoTeacher.findOne(idTeacher);
        if (!contentResponse) {
            managerException<Content>(contentResponse, Content, idContent);
        }
        if (!teacherResponse) {
            managerException<Teacher>(teacherResponse, Teacher, idTeacher);
        }
        if (!content.title || !content.contentType || !content.description || !content.id) {
            throw new BadRequestException('The content type, title and description fields cannot be empty');
        }
        const contentUpdated = await this.repoContent.save(content);
        return contentUpdated;
    }

    async finishContent(idContent: string, idStudent: string) {
        const studentResponse = await this.repoStudent.findOne({ relations: ['finishedContents'], where: { id: idStudent } });
        const contentResponse = await this.repoContent.findOne({ relations: ['course'], where: { id: idContent } });
        const studentEnrolled = studentResponse.enrolledCourses?.some(course => course.id === contentResponse.course.id);

        if(!studentEnrolled) {
            const contentNotFinished = !studentResponse.finishedContents.some(content => content.id === contentResponse.id);
            if(contentNotFinished) {
                studentResponse.finishedContents.push(contentResponse);
                await this.repoStudent.save(studentResponse);
                return studentResponse;
            } else {
                const allContentsIds = studentResponse.finishedContents.map(content => content.id);
                const indexElement = allContentsIds.indexOf(contentResponse.id);
                studentResponse.finishedContents.splice(indexElement, 1);
                await this.repoStudent.save(studentResponse);
                return studentResponse;
            }
        }
        throw new ForbiddenException('You are not enrolled');
    }

}
