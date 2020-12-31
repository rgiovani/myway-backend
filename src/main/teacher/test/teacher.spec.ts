import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherModule } from '../teacher.module';
import supertest = require('supertest');
import { Repository } from 'typeorm';
import Rating from '../Rating.entity';
import { unlinkSync } from 'fs';
import { join } from 'path';
import Teacher from '../Teacher.entity';

describe('Teachers', () => {
    let repoRating: Repository<Rating>;
    let repositoryTeacher: Repository<Teacher>;
    let app: INestApplication;
    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                TeacherModule,
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
        repoRating = module.get('RatingRepository');
        repositoryTeacher = module.get('TeacherRepository');
        await app.init();
    });

    describe('/teachers/:id/courses', () => {
        it('returns status 200 when finding content', async () => {
            await supertest
                .agent(app.getHttpServer())
                .get('/teachers/48935754-9a97-40d8-b6b4-0a808597f314/courses/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
        });
        it('return total courses taught', async () => {
            const { body } = await supertest
                .agent(app.getHttpServer())
                .get('/teachers/48935754-9a97-40d8-b6b4-0a808597f314/courses/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);
            const { coursesTaught, averageCoursesTaught } = body;
            expect(coursesTaught.length).toBe(4);
            expect(averageCoursesTaught).toBe(1.5);
        });
    });

    describe('/teachers/:idTeacher/:idStudent/score', () => {
        it('returns status 200 when the student score the teacher.', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .put('/teachers/48935754-9a97-40d8-b6b4-0a808597f314/2d509ce5-1ee0-4a8f-ae04-59d0db3bf137/score')
                .send({
                    value: 5
                });
            expect(status).toBe(200);
        });
        it('returns status 200 when the student update his score on the same teacher.', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .put('/teachers/48935754-9a97-40d8-b6b4-0a808597f314/2d509ce5-1ee0-4a8f-ae04-59d0db3bf137/score')
                .send({
                    value: 1
                });
            expect(status).toBe(200);
        });
        it('returns status 400, score cannot be greater than 5.', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .put('/teachers/48935754-9a97-40d8-b6b4-0a808597f314/2d509ce5-1ee0-4a8f-ae04-59d0db3bf137/score')
                .send({
                    value: 6
                });
            expect(status).toBe(400);
        });
        it('returns status 403, student cannot evaluate himself as a teacher.', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .put('/teachers/48935754-9a97-40d8-b6b4-0a808597f314/48935754-9a97-40d8-b6b4-0a808597f314/score')
                .send({
                    value: 5
                });
            expect(status).toBe(403);
        });
        it('returns status 404, teacher id not found.', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .put('/teachers/4854-9a97-40d8-b6b4-0a808597f314/2d509ce5-1ee0-4a8f-ae04-59d0db3bf137/score')
                .send({
                    value: 5
                });
            expect(status).toBe(404);
        });
        it('returns status 404, student id not found.', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .put('/teachers/4854-9a97-40d8-b6b4-0a808597f314/2dce5-1ee0-4a8f-ae04-59d0db3bf137/score')
                .send({
                    value: 5
                });
            expect(status).toBe(404);
        });
    });
    
    afterAll(async () => {
        await repoRating.createQueryBuilder()
            .update()
            .set({
                totalScore: 5,
                numberOfRatings: 1
            }).where('id = :id', { id: '826d1e31-a9e5-4017-b0c0-bc63d74b3480' })
            .execute();
        await repoRating.query('DELETE FROM rate_teacher WHERE student_id = \'2d509ce5-1ee0-4a8f-ae04-59d0db3bf137\' AND teacher_id = \'48935754-9a97-40d8-b6b4-0a808597f314\'');
        await app.close();

    });
});
