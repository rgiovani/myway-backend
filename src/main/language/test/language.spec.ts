import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageModule } from '../language.module';
import supertest = require('supertest');

describe('Languages', () => {
    let app: INestApplication;
    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                LanguageModule,
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

    describe('GET /languages', () => {
        it('returns an array with 4 translator languages', async () => {
            const { body } = await supertest
                .agent(app.getHttpServer())
                .get('/languages/courses')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(Array.isArray(body)).toBe(true);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
