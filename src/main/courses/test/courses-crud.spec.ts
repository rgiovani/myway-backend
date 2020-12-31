import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from '../courses.module';
import supertest = require('supertest');
import { join } from 'path';

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
    let id: string;
    describe('/courses/add/:idTeacher', () => {
        it('return 200 - sucess return.', async () => {
            const { body, status } = await supertest
                .agent(app.getHttpServer())
                .post('/courses/add/2d509ce5-1ee0-4a8f-ae04-59d0db3bf137')
                .set('Content-Type', 'multipart/form-data')
                .attach('image', join(__dirname, '/', 'russo.jpg'))
                .field('title', 'Curso de Russo')
                .field('subtitle', 'Ensinando de um jeito simples.')
                .field('description', 'Aprender russo de uma forma descontraida.')
                .field('studentPrerequisites', 'Não há pré-requisitos')
                .field('studentTargets', 'concurseiros, pessoas de primeira viagem.')
                .field('goals', 'Entender o idioma russo.')
                .field('level', 'BEGINNER')
                .field('language', 'Russo');
            id = body.id;

            expect(body.title).toBe('Curso de Russo');
            expect(body.subtitle).toBe('Ensinando de um jeito simples.');
            expect(body.description).toBe('Aprender russo de uma forma descontraida.');
            expect(body.studentPrerequisites).toBe('Não há pré-requisitos');
            expect(body.studentTargets).toBe('concurseiros, pessoas de primeira viagem.');
            expect(body.goals).toBe('Entender o idioma russo.');
            expect(body.level).toBe('BEGINNER');
            expect(body.language[0].name).toBe('Russo');
            expect(status).toBe(201);
        });

        it('should return 400 status when the teacher does not send an image', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .post('/courses/add/2d509ce5-1ee0-4a8f-ae04-59d0db3bf137')
                .set('Content-Type', 'multipart/form-data')
                .field('title', 'Curso de Russo')
                .field('subtitle', 'Ensinando de um jeito simples.')
                .field('description', 'Aprender russo de uma forma descontraida.')
                .field('studentPrerequisites', 'Não há pré-requisitos')
                .field('studentTargets', 'concurseiros, pessoas de primeira viagem.')
                .field('goals', 'Entender o idioma russo.')
                .field('level', 'BEGINNER')
                .field('language', 'Russo');
            expect(status).toBe(400);
        });

        it('PUT - /courses/edit/:idTeacher/:idCourse returns status 200 when the change is successful', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .put(`/courses/edit/2d509ce5-1ee0-4a8f-ae04-59d0db3bf137/${id}`)
                .set('Content-Type', 'multipart/form-data')
                .attach('image', join(__dirname, '/', 'mandarim.jpg'))
                .field('title', 'Curso de mandarim')
                .field('subtitle', 'Ensinando mandarim de um jeito unico.')
                .field('description', 'Aprender mandarim de uma forma descontraida.')
                .field('studentPrerequisites', 'Não há pré-requisitos')
                .field('studentTargets', 'concurseiros, pessoas continentais.')
                .field('goals', 'Entender o idioma mandarim.')
                .field('level', 'BEGINNER')
                .field('language', 'Mandarim')
                .field('id', `${id}`);

            expect(status).toBe(200);
        });

        it('PUT - /courses/edit/:idTeacher/:idCourse returns status 404 when teacher not found', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .put(`/courses/edit/27704b01-89eb-4760-b6eb-a590326b9223/${id}`)
                .set('Content-Type', 'multipart/form-data')
                .field('title', 'Curso de mandarim')
                .field('subtitle', 'Ensinando mandarim de um jeito unico.')
                .field('description', 'Aprender mandarim de uma forma descontraida.')
                .field('studentPrerequisites', 'Não há pré-requisitos')
                .field('studentTargets', 'concurseiros, pessoas continentais.')
                .field('goals', 'Entender o idioma mandarim.')
                .field('level', 'BEGINNER')
                .field('language', 'Mandarim')
                .field('id', `${id}`);

            expect(status).toBe(404);
        });

        it('PUT - /courses/edit/:idTeacher/:idCourse returns status 404 when course not found', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .put('/courses/edit/2d509ce5-1ee0-4a8f-ae04-59d0db3bf137/26f086cc-7f3c-401f-a2c6-153a4ef2e79f')
                .set('Content-Type', 'multipart/form-data')
                .field('title', 'Curso de mandarim')
                .field('subtitle', 'Ensinando mandarim de um jeito unico.')
                .field('description', 'Aprender mandarim de uma forma descontraida.')
                .field('studentPrerequisites', 'Não há pré-requisitos')
                .field('studentTargets', 'concurseiros, pessoas continentais.')
                .field('goals', 'Entender o idioma mandarim.')
                .field('level', 'BEGINNER')
                .field('language', 'Mandarim')
                .field('id', `${id}`);

            expect(status).toBe(404);
        });

        it('DELETE - courses/delete/:idTeacher/:idCourse returns 200 status delete sucess', async (done) => {
            await supertest
                .agent(app.getHttpServer())
                .delete(`/courses/delete/2d509ce5-1ee0-4a8f-ae04-59d0db3bf137/${id}`)
                .expect(200);
            done();
        });

        it('DELETE - courses/delete/:idTeacher/:idCourse returns 404 when teacher not found', async (done) => {
            await supertest
                .agent(app.getHttpServer())
                .delete(`/courses/delete/73ef5879-eba7-4d9c-8e34-4a95be61f4af/${id}`)
                .expect(404);
            done();
        });

        it('DELETE - courses/delete/:idTeacher/:idCourse returns 404 when course not found', async (done) => {
            await supertest
                .agent(app.getHttpServer())
                .delete('/courses/delete/2d509ce5-1ee0-4a8f-ae04-59d0db3bf137/40d44577-0809-448a-8eb4-79158aee16db')
                .expect(404);
            done();
        });
    });

    afterAll(async () => {
        await app.close();
    });

});
