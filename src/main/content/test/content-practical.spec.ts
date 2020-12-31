import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentModule } from '../content.module';
import supertest = require('supertest');

describe('Content practical', () => {
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
    let id: string;
    describe('Content practical - POST contents/course/idCourse/teacher/idTeacher/practical', () => {
        it('POST returns 201 status and content data', async () => {
            const { body, status } = await supertest
                .agent(app.getHttpServer())
                .post('/contents/course/6b71ea9f-53c1-48ab-9139-84b6fea688bf/teacher/48935754-9a97-40d8-b6b4-0a808597f314/practical')
                .set('Accept', 'application/json')
                .send({
                    title: 'Aula pratica',
                    contentType: 'PRACTICAL',
                    description: 'Hora de colocar em prática o que voce aprendeu',
                    link: 'http://www.sitequeoprofessorcolocar.com.br',
                    course: {
                        id: '6b71ea9f-53c1-48ab-9139-84b6fea688bf'
                    }
                });
            id = body.id;
            expect(body.title).toBe('Aula pratica');
            expect(body.contentType).toBe('PRACTICAL');
            expect(body.description).toBe('Hora de colocar em prática o que voce aprendeu');
            expect(body.link).toBe('http://www.sitequeoprofessorcolocar.com.br');
            expect(body.course.id).toBe('6b71ea9f-53c1-48ab-9139-84b6fea688bf');
            expect(status).toBe(201);
        });
        it('POST returns 401 status when course does not belong to the teacher', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .post('/contents/course/6b71ea9f-53c1-48ab-9139-84b6fea688bf/teacher/9438b07e-6f03-4023-b5a2-b5aab3ce3104/practical')
                .set('Accept', 'application/json')
                .send({
                    title: 'Aula pratica',
                    contentType: 'PRACTICAL',
                    description: 'Hora de colocar em prática o que voce aprendeu',
                    link: 'http://www.sitequeoprofessorcolocar.com.br',
                    course: {
                        id: '6b71ea9f-53c1-48ab-9139-84b6fea688bf'
                    }
                });
            expect(status).toBe(401);
        });
        it('POST returns 404 status when course does not exist teacher', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .post('/contents/course/1a510ea8-6a0c-472a-82a9-685a327d24d2/teacher/48935754-9a97-40d8-b6b4-0a808597f314/practical')
                .set('Accept', 'application/json')
                .send({
                    title: 'Aula pratica',
                    contentType: 'PRACTICAL',
                    description: 'Hora de colocar em prática o que voce aprendeu',
                    link: 'http://www.sitequeoprofessorcolocar.com.br',
                    course: {
                        id: '6b71ea9f-53c1-48ab-9139-84b6fea688bf'
                    }
                });
            expect(status).toBe(404);
        });
        it('POST return status 400 should be returned if the DESCRIPTION field is empty', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .post('/contents/course/6b71ea9f-53c1-48ab-9139-84b6fea688bf/teacher/48935754-9a97-40d8-b6b4-0a808597f314/practical')
                .set('Accept', 'application/json')
                .send({
                    title: 'Aula pratica',
                    contentType: 'PRACTICAL',
                    link: 'http://www.sitequeoprofessorcolocar.com.br',
                    course: {
                        id: '6b71ea9f-53c1-48ab-9139-84b6fea688bf'
                    }
                });
            expect(status).toBe(400);
        });
        it('POST return status 400 should be returned if the CONTENTTYPE field is empty', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .post('/contents/course/6b71ea9f-53c1-48ab-9139-84b6fea688bf/teacher/48935754-9a97-40d8-b6b4-0a808597f314/practical')
                .set('Accept', 'application/json')
                .send({
                    title: 'Aula pratica',
                    description: 'Hora de colocar em prática o que voce aprendeu',
                    link: 'http://www.sitequeoprofessorcolocar.com.br',
                    course: {
                        id: '6b71ea9f-53c1-48ab-9139-84b6fea688bf'
                    }
                });
            expect(status).toBe(400);
        });
        it('POST return status 400 should be returned if the TITLE field is empty', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .post('/contents/course/6b71ea9f-53c1-48ab-9139-84b6fea688bf/teacher/48935754-9a97-40d8-b6b4-0a808597f314/practical')
                .set('Accept', 'application/json')
                .send({
                    contentType: 'PRACTICAL',
                    description: 'Hora de colocar em prática o que voce aprendeu',
                    link: 'http://www.sitequeoprofessorcolocar.com.br',
                    course: {
                        id: '6b71ea9f-53c1-48ab-9139-84b6fea688bf'
                    }
                });
            expect(status).toBe(400);
        });
    });
    describe('PUT /contents/idContent/teacher/idTeacher/practical', () => {
        it('PUT returns 404 status when content does not exist', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .put('/contents/db3f776e-fe5c-45aa-bd07-85178155b61a/teacher/48935754-9a97-40d8-b6b4-0a808597f314/practical')
                .set('Accept', 'application/json')
                .send({
                    title: 'Aula pratica',
                    contentType: 'PRACTICAL',
                    description: 'Hora de colocar em prática o que voce aprendeu',
                    link: 'http://www.sitequeoprofessorcolocar.com.br',
                    course: {
                        id: '6b71ea9f-53c1-48ab-9139-84b6fea688bf'
                    }
                });
            expect(status).toBe(404);
        });
        it('PUT returns 404 status when teacher does not exist', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .put('/contents/2085d754-2107-4d70-bf4a-f44ee306e140/teacher/63caffc9-c336-4762-892a-3b8ef5342a34/practical')
                .set('Accept', 'application/json')
                .send({
                    title: 'Aula pratica',
                    contentType: 'PRACTICAL',
                    description: 'Hora de colocar em prática o que voce aprendeu',
                    link: 'http://www.sitequeoprofessorcolocar.com.br',
                    course: {
                        id: '6b71ea9f-53c1-48ab-9139-84b6fea688bf'
                    }
                });
            expect(status).toBe(404);
        });
        it('PUT return status 400 should be returned if the DESCRIPTION field is empty', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .put('/contents/2085d754-2107-4d70-bf4a-f44ee306e140/teacher/48935754-9a97-40d8-b6b4-0a808597f314/practical')
                .set('Accept', 'application/json')
                .send({
                    title: 'Aula pratica',
                    contentType: 'PRACTICAL',
                    link: 'http://www.sitequeoprofessorcolocar.com.br',
                    course: {
                        id: '6b71ea9f-53c1-48ab-9139-84b6fea688bf'
                    }
                });
            expect(status).toBe(400);
        });
        it('PUT return status 400 should be returned if the CONTENTTYPE field is empty', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .put('/contents/2085d754-2107-4d70-bf4a-f44ee306e140/teacher/48935754-9a97-40d8-b6b4-0a808597f314/practical')
                .set('Accept', 'application/json')
                .send({
                    title: 'Aula pratica',
                    description: 'Hora de colocar em prática o que voce aprendeu',
                    link: 'http://www.sitequeoprofessorcolocar.com.br',
                    course: {
                        id: '6b71ea9f-53c1-48ab-9139-84b6fea688bf'
                    }
                });
            expect(status).toBe(400);
        });
        it('PUT return status 400 should be returned if the TITLE field is empty', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .put('/contents/2085d754-2107-4d70-bf4a-f44ee306e140/teacher/48935754-9a97-40d8-b6b4-0a808597f314/practical')
                .set('Accept', 'application/json')
                .send({
                    contentType: 'PRACTICAL',
                    description: 'Hora de colocar em prática o que voce aprendeu',
                    link: 'http://www.sitequeoprofessorcolocar.com.br',
                    course: {
                        id: '6b71ea9f-53c1-48ab-9139-84b6fea688bf'
                    }
                });
            expect(status).toBe(400);
        });
        it('PUT should return status 200 and updated content when the change was successful', async () => {
            const { status, body } = await supertest
                .agent(app.getHttpServer())
                .put(`/contents/${id}/teacher/48935754-9a97-40d8-b6b4-0a808597f314/practical`)
                .set('Accept', 'application/json')
                .send({
                    id: id,
                    title: 'Primeira aula pratica com exercicios',
                    contentType: 'PRACTICAL',
                    description: 'Momento onde voce vai colocar em pratica o que voce viu nas aulas anteriores',
                    link: 'http://www.sitequeoprofessorcolocar.com.br',
                    course: {
                        id: '6b71ea9f-53c1-48ab-9139-84b6fea688bf'
                    }
                });
            expect(body.title).toBe('Primeira aula pratica com exercicios');
            expect(body.contentType).toBe('PRACTICAL');
            expect(body.description).toBe('Momento onde voce vai colocar em pratica o que voce viu nas aulas anteriores');
            expect(body.link).toBe('http://www.sitequeoprofessorcolocar.com.br');
            expect(body.course.id).toBe('6b71ea9f-53c1-48ab-9139-84b6fea688bf');
            expect(status).toBe(200);
        });
    });

    describe('GET /content/:id', () => {
        it('returns status 200 when it finds content', async () => {
            const { status, body } = await supertest
                .agent(app.getHttpServer())
                .get('/contents/5101937f-a24f-40f0-b812-0a31d5f351ad')
                .set('Accept', 'application/json');
            expect(body.title).toBe('Primeira Prática');
            expect(body.contentType).toBe('PRACTICAL');
            expect(body.description).toBe('Nessa aula voce vai colocar em prática o que voce aprendeu');
            expect(body.link).toBe('http://google.com.br');
            expect(status).toBe(200);
        });
        it('returns 404 status when not finding content', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .get('/contents/ac973764-dd03-4bc3-aeaa-520b41ab81b1')
                .set('Accept', 'application/json');
            expect(status).toBe(404);
        });
    });

    describe('DELETE /content/:id', () => {
        it('returns status 200 when delete content', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .delete(`/contents/${id}`)
                .set('Accept', 'application/json');
            expect(status).toBe(200);
        });
        it('returns 404 status when content not found', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .delete('/contents/6fb6df99-f4a8-42cf-b751-f02b13ab5a0b')
                .set('Accept', 'application/json');
            expect(status).toBe(404);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
