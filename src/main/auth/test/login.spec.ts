import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth.module';
import supertest = require('supertest');

describe('Student', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                AuthModule,
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

    describe('POST /auth/login', () => {
        it('should return 401 status when the email and password is incorrect', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'email@naoexiste.com', password: '123456' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);
            expect(status).toBe(401);
        });
        it('should return status 200 and student data when the email and password is correct', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'marcosdasilva@email.com', password: '1234567' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);
            expect(status).toBe(201);
        });
        it('should return status 200 when teacher', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'luizantonio@email.com', password: '12345' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);
            expect(status).toBe(201);
        });
    });
    afterAll(async () => {
        await app.close();
    });
});
