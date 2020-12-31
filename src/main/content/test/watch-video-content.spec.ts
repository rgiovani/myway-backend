import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentModule } from '../content.module';
import supertest = require('supertest');

describe('Watch-Content', () => {
    let app: INestApplication;
    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                ContentModule,
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
    describe('GET content/:id/student/:idStudent', () => {
        it('returns content data and status 200', async () => {
            const { body, status } = await supertest
                .agent(app.getHttpServer())
                .get('/contents/2085d754-2107-4d70-bf4a-f44ee306e140/student/9008a0ef-fdff-4cea-9884-8cf5bc91c8ee/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);
            expect(status).toBe(200);
            expect(body.title).toBe('O básico sobre o idioma espanhol');
            expect(body.contentType).toBe('VIDEO');
            expect(body.description).toBe('Aqui voce aprender sobre o basico do idioma espanhol');
        });
        it('returns status 403 when the student is not enrolled in the course', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .get('/contents/2085d754-2107-4d70-bf4a-f44ee306e140/student/e78d4e78-f9db-453d-ac32-07292061e6b6/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);
            expect(status).toBe(403);
        });
        it('returns 404 status when a student is not found', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .get('/contents/2085d754-2107-4d70-bf4a-f44ee306e140/student/0df88aa6-d7bd-4c34-b059-d75cefb9797a/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);
            expect(status).toBe(404);
        });
        it('returns 404 status when content is not found', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .get('/contents/56641886-3493-437f-bf33-6b75938e126d/student/e78d4e78-f9db-453d-ac32-07292061e6b6/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);
            expect(status).toBe(404);
        });
    });
    afterAll(async () => {
        await app.close();
    });
});
