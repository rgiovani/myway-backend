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

    afterAll(async () => {
        await app.close();
    });

    describe('GET /courses/search/ RETURN 404', () => {
        it('return an http status 404 from bad search', async () => {
            const { body } = await supertest
                .agent(app.getHttpServer())
                .get('/courses/search?f=cudsl nlsand')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(body.message).toBe('NOT_FOUND');
        });
    });

    describe('GET /courses/search/  RETURN language:ALEMAO', () => {
        it('return an array of courses by field language', async () => {
            const { body } = await supertest
                .agent(app.getHttpServer())
                .get('/courses/search?f=quero aprender alemao')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(body.message).toBe('OK');
            expect(body.result[0].language[0].name).toBe('ALEMAO');
            expect(body.result[0].level).toBe('INICIANTE');
        });
    });

    describe('GET /courses/search/  RETURN language:FRANCES', () => {
        it('return an array of courses by field language', async () => {
            const { body } = await supertest
                .agent(app.getHttpServer())
                .get('/courses/search?f=quero aprender frances')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(body.message).toBe('OK');
            expect(body.result[0].language[0].name).toBe('FRANCES');
            expect(body.result[0].level).toBe('AVANCADO');
        });
    });

    describe('GET /courses/ RETURN level:AVANCADO', () => {
        it('return an array of courses by field level', async () => {
            const { body } = await supertest
                .agent(app.getHttpServer())
                .get('/courses/search?f=avancado')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(body.message).toBe('OK');
            expect(body.result[0].level).toBe('AVANCADO');
        });
    });

    describe('GET /courses/ RETURN teacher:THIAGO', () => {
        it('return an array of courses by field teacher name', async () => {
            const { body } = await supertest
                .agent(app.getHttpServer())
                .get('/courses/search?f=curso com o thiago')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(body.result[0].teacher.user.firstName).toBe('Thiago');
        });
    });

    describe('GET /courses/ RETURN Course with language:FRANCES', () => {
        it('return an array of courses by field language', async () => {
            const { body } = await supertest
                .agent(app.getHttpServer())
                .get('/courses/search?f=o iori quer aprender frances')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(body.result[0].language[0].name).toBe('FRANCES');
        });
    });

    describe('GET /courses/:language/search RETURN Course with language:FRANCES', () => {
        it('return an array of courses by field language', async () => {
            const { body } = await supertest
                .agent(app.getHttpServer())
                .get('/courses/FRANCES/search/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(body[0].language[0].name).toBe('FRANCES');
        });
    });

    describe('GET /courses/:language/search RETURN STATUS:NOT_FOUND', () => {
        it('return an http status 404 from bad search', async () => {
            await supertest
                .agent(app.getHttpServer())
                .get('/courses/NENHUM/search/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404);
        });
    });

    describe('GET /courses/search RETURN Course with field:cursos iniciante language:INGLES sort:DESC', () => {
        it('return an array of courses by field, language and sort', async () => {
            const { body } = await supertest
                .agent(app.getHttpServer())
                .get('/courses/search?f=cursos iniciante&l=ingles&s=desc')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(body.result[0].language[0].name).toBe('INGLÊS');
            expect(body.result[0].level).toBe('INICIANTE');
        });
    });

    describe('GET /courses/search RETURN Course with field:cursos iniciante language:INGLES sort:DESC', () => {
        it('return an array of courses by field:null and language: ingles', async () => {
            const { body } = await supertest
                .agent(app.getHttpServer())
                .get('/courses/search?f=&l=ingles&s=desc')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(body.result[0].language[0].name).toBe('INGLÊS');
        });
    });

    describe('GET /courses/search RETURN course by teacher last name', () => {
        it('return an array of courses who contains in field: teacher last name', async () => {
            const { body } = await supertest
                .agent(app.getHttpServer())
                .get('/courses/search?f=aprender ingles com o antonio')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(body.result[0].teacher.user.firstName).toBe('Luiz');
            expect(body.result[0].teacher.user.lastName).toBe('Antonio');
            expect(body.result[0].level).toBe('INICIANTE');
            expect(body.result[0].language[0].name).toBe('INGLÊS');
        });
    });

    describe('GET /courses/search RETURN Course by level, language and teacher params', () => {
        it('return an array of courses who contains in field: teacher & level & language', async () => {
            const { body } = await supertest
                .agent(app.getHttpServer())
                .get('/courses/search?f=aprender ingles iniciante com o luiz')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(body.result[0].language[0].name).toBe('INGLÊS');
            expect(body.result[0].level).toBe('INICIANTE');
            expect(body.result[0].teacher.user.firstName).toBe('Luiz');
        });
    });

    describe('GET /courses/search RETURN Course by level and teacher params', () => {
        it('return an array of courses who contains in field: teacher & level', async () => {
            const { body } = await supertest
                .agent(app.getHttpServer())
                .get('/courses/search?f=aprender curso iniciante com o thiago')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(body.result[0].level).toBe('INICIANTE');
            expect(body.result[0].teacher.user.firstName).toBe('Thiago');
        });
    });

    describe('GET /courses/search RETURN courses from empty field, language and sort', () => {
        it('return an array of all courses ', async () => {
            await supertest
                .agent(app.getHttpServer())
                .get('/courses/search?f=&l=&s=')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });

    describe('GET /courses/search RETURN courses from empty field, language. Sort = ASC', () => {
        it('return an array of all courses sorted by ASC', async () => {
            const { body } = await supertest
                .agent(app.getHttpServer())
                .get('/courses/search?f=&l=&s=ASC')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(body.result[0].totalScore).toBe(0);
        });
    });

});
