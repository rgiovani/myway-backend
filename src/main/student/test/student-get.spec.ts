import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentModule } from '../student.module';
import supertest = require('supertest');

describe('Student', () => {
    let app: INestApplication;
    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                StudentModule,
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
    afterAll(async () => {
        await app.close();
    });
    describe('GET /students', () => {
        it('should return status 404 with student not found', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .get('/students/7bd45af8-9302-473a-9041-ed1d06ca9e67')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);
            expect(status).toBe(404);
        });
        it('should returns id, firstName, secondName, email and status 200', async () => {
            const { body, status } = await supertest
                .agent(app.getHttpServer())
                .get('/students/36a39c36-a2fa-4c3f-a805-3a000721d018')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);
            expect(body.user.id).toBe('36a39c36-a2fa-4c3f-a805-3a000721d018');
            expect(body.user.firstName).toBe('Marcos');
            expect(body.user.lastName).toBe('Silva');
            expect(body.user.email).toBe('marcosdasilva@email.com');
            expect(status).toBe(200);
        });
        it('should return an array of students', async () => {
            const { body, status } = await supertest
                .agent(app.getHttpServer())
                .get('/students')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);
            expect(body[0].user.id).toBe('2d509ce5-1ee0-4a8f-ae04-59d0db3bf137');
            expect(body[1].user.id).toBe('36a39c36-a2fa-4c3f-a805-3a000721d018');
            expect(body[0].user.firstName).toBe('Thiago');
            expect(body[1].user.firstName).toBe('Marcos');
            expect(body[0].user.lastName).toBe('Montero');
            expect(body[1].user.lastName).toBe('Silva');
            expect(body[0].user.email).toBe('montero-thiago@email.com');
            expect(body[1].user.email).toBe('marcosdasilva@email.com');
            expect(status).toBe(200);
        });
    });

    describe('GET /students/:studentID/courses RETURN enrolled courses', () => {
        it('return an array of all courses from student', async () => {
            await supertest
                .agent(app.getHttpServer())
                .get('/students/9008a0ef-fdff-4cea-9884-8cf5bc91c8ee/courses')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });

    describe('GET /students/:studentID/courses RETURN 404 NOT FOUND', () => {
        it('return 404 NOT FOUND', async () => {
            await supertest
                .agent(app.getHttpServer())
                .get('/students/25d262ff-e506-4c19-9177-1ea7e65ff54a/courses')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404);
        });
    });
});
