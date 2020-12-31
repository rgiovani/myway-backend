import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import Course from '../Course.entity';
import { CoursesModule } from '../courses.module';
import supertest = require('supertest');
import { Repository } from 'typeorm';

describe('Score Course', () => {
    let repositoryCourse: Repository<Course>;
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
        repositoryCourse = module.get('CourseRepository');
        await app.init();
    });

    describe('PUT /courses/:idCourse/student/:idStudent/score', () => {
        it('Return status 200 and new data when the note', async () => {
            const { status, body } = await supertest
                .agent(app.getHttpServer())
                .put('/courses/d2115140-3c6f-4e3d-8331-49c9a898a6e7/student/e78d4e78-f9db-453d-ac32-07292061e6b6/score')
                .send({
                    score: 5
                });
            expect(status).toBe(200);
            expect(body.score).toBe('5');
            expect(body.course_id).toBe('d2115140-3c6f-4e3d-8331-49c9a898a6e7');
            expect(body.student_id).toBe('e78d4e78-f9db-453d-ac32-07292061e6b6');
        });
        it('Return status 200 and new data when the note is successfully changed', async () => {
            const { status, body } = await supertest
                .agent(app.getHttpServer())
                .put('/courses/d2115140-3c6f-4e3d-8331-49c9a898a6e7/student/e78d4e78-f9db-453d-ac32-07292061e6b6/score')
                .send({
                    score: 4
                });
            expect(status).toBe(200);
            expect(body.score).toBe('4');
            expect(body.course_id).toBe('d2115140-3c6f-4e3d-8331-49c9a898a6e7');
            expect(body.student_id).toBe('e78d4e78-f9db-453d-ac32-07292061e6b6');
        });
        it('Return status 200 and score', async () => {
            const { status, body } = await supertest
                .agent(app.getHttpServer())
                .get('/courses/d2115140-3c6f-4e3d-8331-49c9a898a6e7');
            expect(body.totalScore).toBe(8);
            expect(body.numberOfRatings).toBe(3);
            expect(status).toBe(200);
        });
        it('Return status 400 when the score smaller than 0', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .put('/courses/d2115140-3c6f-4e3d-8331-49c9a898a6e7/student/e78d4e78-f9db-453d-ac32-07292061e6b6/score')
                .send({
                    score: -1
                });
            expect(status).toBe(400);
        });
        it('Return status 400 when the score bigger than 0', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .put('/courses/d2115140-3c6f-4e3d-8331-49c9a898a6e7/student/e78d4e78-f9db-453d-ac32-07292061e6b6/score')
                .send({
                    score: 6
                });
            expect(status).toBe(400);
        });
        it('Return status 403 when the user who makes an assessment is the creator of the course', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .put('/courses/d2115140-3c6f-4e3d-8331-49c9a898a6e7/student/2d509ce5-1ee0-4a8f-ae04-59d0db3bf137/score')
                .send({
                    score: 5
                });
            expect(status).toBe(403);
        });
        it('Return status 403  when the student is not enrolled in the course', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .put('/courses/d2115140-3c6f-4e3d-8331-49c9a898a6e7/student/36a39c36-a2fa-4c3f-a805-3a000721d018/score')
                .send({
                    score: 5
                });
            expect(status).toBe(403);
        });
    });

    afterAll(async () => {
        await repositoryCourse.createQueryBuilder()
            .update()
            .set({
                totalScore: 4,
                numberOfRatings: 2
            })
            .where('id = :id', { id: 'd2115140-3c6f-4e3d-8331-49c9a898a6e7' })
            .execute();
        await repositoryCourse.query('UPDATE student_course SET isRated = false, score = 0 WHERE student_id = \'e78d4e78-f9db-453d-ac32-07292061e6b6\' AND course_id = \'d2115140-3c6f-4e3d-8331-49c9a898a6e7\'');
        await app.close();
    });
});
