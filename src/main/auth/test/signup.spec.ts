import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth.module';
import supertest = require('supertest');
import { Repository } from 'typeorm';
import User from '../../../utils/shared/entities/User.entity';

describe('SignUP', () => {
    let repositoryUser: Repository<User>;
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
        repositoryUser = module.get('UserRepository');
        await app.init();
    });
    let id: string;
    describe('POST /auth/signup', () => {
        it('should return 401 status when account exists', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .post('/auth/signup')
                .send({
                    firstName: 'Luiz',
                    lastName: 'Antonio',
                    email: 'luizantonio@email.com',
                    password: '123456'
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);
            expect(status).toBe(401);
        });
        it('should return status 201 and data when account create successfully', async () => {
            const { body, status } = await supertest
                .agent(app.getHttpServer())
                .post('/auth/signup')
                .send({
                    firstName: 'Julia',
                    lastName: 'Silva',
                    email: 'juliasilva@email.com',
                    password: '122333'
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);
            id = body.id;
            expect(body.firstName).toBe('Julia');
            expect(body.lastName).toBe('Silva');
            expect(body.email).toBe('juliasilva@email.com');
            expect(body.password).toBe(undefined);
            expect(status).toBe(201);
            expect(status).toBe(201);
        });
        it('should return status 400 when email invalid', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .post('/auth/signup')
                .send({
                    firstName: 'Julia',
                    lastName: 'Silva',
                    email: 'juliasilva',
                    password: '122333'
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);
            expect(status).toBe(400);
        });
        it('should return status 400 when first name is empty', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .post('/auth/signup')
                .send({
                    firstName: '',
                    lastName: 'Pereira',
                    email: 'carlos.pereira@email.com',
                    password: '122333'
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);
            expect(status).toBe(400);
        });
    });

    afterAll(async () => {
        await repositoryUser.delete(id);
        await app.close();
    });
});
