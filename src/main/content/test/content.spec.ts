import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Repository } from 'typeorm';
import Content from '../Content.entity';
import { ContentModule } from '../content.module';
import supertest = require('supertest');

describe('Contents', () => {
    let app: INestApplication;
    let repositoryContent: Repository<Content>;
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
        repositoryContent = module.get('ContentRepository');
        await app.init();
    });

    describe('GET /courses/:id/content', () => {
        it('returns 404 status when not finding content', async () => {
            await supertest
                .agent(app.getHttpServer())
                .get('/contents/4a42552d-6c34-48f8-84d7-34a097ac1443')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404);
        });
        it('returns content data', async () => {
            const { body } = await supertest
                .agent(app.getHttpServer())
                .get('/contents/f31f237e-25db-4c4c-8c70-7b5faf050b83')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(body.title).toBe('Aula Introdutoria');
            expect(body.contentType).toBe('VIDEO');
            expect(body.description).toBe('Aqui voce vai ver como sera a metodologia');
        });
    });
    let id: string;
    describe('Content', () => {
        it('POST returns 201 status and content data', async () => {
            const { body, status } = await supertest
                .agent(app.getHttpServer())
                .post('/contents/course/6b71ea9f-53c1-48ab-9139-84b6fea688bf/teacher/48935754-9a97-40d8-b6b4-0a808597f314')
                .set('Content-Type', 'multipart/form-data')
                .attach('file', join(__dirname, '/', 'teste.mp4'))
                .field('title', 'Como praticar ingles ?')
                .field('contentType', 'VIDEO')
                .field('description', 'Aqui você vai aprender como praticar ingles de forma fácil e rápida');
            id = body.id;
            expect(body.title).toBe('Como praticar ingles ?');
            expect(body.contentType).toBe('VIDEO');
            expect(body.description).toBe('Aqui você vai aprender como praticar ingles de forma fácil e rápida');
            expect(status).toBe(201);
        });
        it('PUT /contents/:id returns status 200 when the change is successful', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .put(`/contents/${id}`)
                .set('Content-Type', 'multipart/form-data')
                .attach('file', join(__dirname, '/', 'update.mp4'))
                .field('title', 'Como praticar ingles de forma pratica e efetiva ?')
                .field('contentType', 'VIDEO')
                .field('description', 'Aqui você vai aprender como praticar ingles de forma prática e efetiva, para melhorar a sua pronuncia');
            expect(status).toBe(200);
        });
        it('DELETE /contents/:id returns 404 status delete sucess', async (done) => {
            await supertest
                .agent(app.getHttpServer())
                .delete('/contents/8884c970-e542-477f-9be2-71b3e6e6b521')
                .expect(404);
            done();
        });
        it('DELETE /contents/:id returns 404 status delete sucess', async (done) => {
            await supertest
                .agent(app.getHttpServer())
                .delete('/contents/8884c970-e542-477f-9be2-71b3e6e6b521')
                .expect(404);
            done();
        });
        it('DELETE /contents/:id returns 200 status delete sucess', async (done) => {
            await supertest
                .agent(app.getHttpServer())
                .delete(`/contents/${id}`)
                .expect(200);
            done();
        });
    });
    afterAll(async () => {
        await repositoryContent.query(`DELETE FROM contents WHERE id = '${id}'`);
        await app.close();
    });
});
