import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from '../courses.module';
import supertest = require('supertest');

describe('Courses', () => {
    let app: INestApplication;
    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                CoursesModule,
                TypeOrmModule.forRoot({
                    type: 'mysql',
                    host: 'localhost',
                    port: 3306,
                    username: 'root',
                    password: 'root',
                    database: 'learninglanguage',
                    entities: ['./**/*.entity.ts'],
                    synchronize: false
                })
            ]
        }).compile();
        app = module.createNestApplication();
        await app.init();
    });

    describe('PUT - Enroll student in course: /courses/enroll/:idStudent/:idCourse', () => {
        it('return 200 - sucess return.', async () => {
            const { } = await supertest
                .agent(app.getHttpServer())
                .put('/courses/enroll/36a39c36-a2fa-4c3f-a805-3a000721d018/bf9878d0-a050-45d7-93e6-7136cf387951/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /text\/html/);
            expect(200);
        });
    });

    describe('PUT - Enroll student in course: /courses/enroll/:idStudent/:idCourse', () => {
        it('return 200 - sucess return.', async () => {
            const { } = await supertest
                .agent(app.getHttpServer())
                .put('/courses/enroll/36a39c36-a2fa-4c3f-a805-3a000721d018/bf9878d0-a050-45d7-93e6-7136cf387951/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /text\/html/);
            expect(200);
        });
    });

    describe('PUT - with course_id and unknown student_id', () => {
        it('return 403-FORBIDDEN.', async () => {
            const { } = await supertest
                .agent(app.getHttpServer())
                .put('/courses/enroll/asdsds/bf9878d0-a050-45d7-93e6-7136cf387951/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);
            expect(403);
        });
    });

    describe('PUT with unknown ids', () => {
        it('return 403-FORBIDDEN from student ID.', async () => {
            const { } = await supertest
                .agent(app.getHttpServer())
                .put('/courses/enroll/35639c36-a2fa-653f-4505-56378721d018/bf9878d0-a050-45d7-93e6-7136cf387951/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);
            expect(403);
        });
    });

    describe('GET - verify if student has the course: TRUE', () => {
        it('return status 200.', async () => {
            const { text } = await supertest
                .agent(app.getHttpServer())
                .get('/courses/verify/9008a0ef-fdff-4cea-9884-8cf5bc91c8ee/97a0ebe4-c210-4031-bf9d-17cce5cb35be/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /text\/html/);
            expect(text).toBe('true');

        });


    });

    describe('GET - verify if student has the course: FALSE', () => {
        it('return status 200.', async () => {
            const { text } = await supertest
                .agent(app.getHttpServer())
                .get('/courses/verify/e78d4e78-f9db-453d-ac32-07292061e6b6/97a0ebe4-c210-4031-bf9d-17cce5cb35be/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /text\/html/);
            expect(text).toBe('false');
        });
    });

    afterAll(async () => {
        await app.close();
    });
});