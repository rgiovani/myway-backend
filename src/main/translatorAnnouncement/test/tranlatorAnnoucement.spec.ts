import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslatorAnnouncementModule } from '../translatorAnnouncement.module';
import supertest = require('supertest');
import TranslatorAnnouncement from '../TranslatorAnnouncement.entity';
import { Repository } from 'typeorm';

describe('Translator Announcement', () => {
    let app: INestApplication;
    let repositoryTranslatorAnnouncement: Repository<TranslatorAnnouncement>;
    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                TranslatorAnnouncementModule,
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
        repositoryTranslatorAnnouncement = module.get('TranslatorAnnouncementRepository');
        await app.init();
    });

    let id;
    describe('POST', () => {
        it('return status 201 and the data of the created ad', async () => {
            const { body, status } = await supertest
                .agent(app.getHttpServer())
                .post('/translatorAnnouncements')
                .send({
                    title: 'Tradutor de Ingles',
                    subtitle: 'Tradutor de Ingles',
                    description: 'Trabalho com traduções simultaneas em reuniões remotas ou presenciais.',
                    price: 100,
                    phone: '044012345678',
                    user: {
                        id: '48935754-9a97-40d8-b6b4-0a808597f314'
                    }
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);
            id = body.id;
            expect(body.title).toBe('Tradutor de Ingles');
            expect(body.subtitle).toBe('Tradutor de Ingles');
            expect(body.description).toBe('Trabalho com traduções simultaneas em reuniões remotas ou presenciais.');
            expect(body.price).toBe(100);
            expect(body.phone).toBe('044012345678');
            expect(body.user.id).toBe('48935754-9a97-40d8-b6b4-0a808597f314');
            expect(status).toBe(201);
        });
    });
    describe('PUT', () => {
        it('return status 200 and new data when changing ad', async () => {
            const { body, status } = await supertest
                .agent(app.getHttpServer())
                .put(`/translatorAnnouncements/${id}`)
                .send({
                    id: id,
                    title: 'Tradutor de Ingles para viagens ou reuniões',
                    subtitle: 'Tradutor de Ingles',
                    description: 'Trabalho como tradutor em suas viagens ou reuniões presenciais.',
                    price: 150,
                    phone: '044012345678',
                    user: {
                        id: '48935754-9a97-40d8-b6b4-0a808597f314'
                    }
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);
            expect(body.title).toBe('Tradutor de Ingles para viagens ou reuniões');
            expect(body.description).toBe('Trabalho como tradutor em suas viagens ou reuniões presenciais.');
            expect(body.price).toBe(150);
            expect(status).toBe(200);
        });
        it('returns status 400 the route parameter id is different from the body id', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .put(`/translatorAnnouncements/${id}`)
                .send({
                    id: '2a889790-bef5-4852-bfbd-fffa2e9c0e6b',
                    title: 'Tradutor de Ingles para viagens ou reuniões',
                    subtitle: 'Tradutor de Ingles',
                    description: 'Trabalho como tradutor em suas viagens ou reuniões presenciais.',
                    price: 150,
                    phone: '044012345678',
                    user: {
                        id: '48935754-9a97-40d8-b6b4-0a808597f314'
                    }
                })
                .set('Accept', 'application/json');
            expect(status).toBe(400);
        });
        it('returns status 404 when it does not find the record to make a change', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .put('/translatorAnnouncements/d8f90c05-beed-473c-a78c-879f8e1ccadc')
                .set('Accept', 'application/json');
            expect(status).toBe(404);
        });
    });

    describe('GET', () => {
        it('returns the total number of ads', async () => {
            const { body } = await supertest
                .agent(app.getHttpServer())
                .get('/translatorAnnouncements')
                .set('Accept', 'application/json');
            expect(body.length).toBe(5);
        });
    });
    describe('DELETE', () => {
        it('returns status 200 when deleting a record', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .del(`/translatorAnnouncements/${id}`)
                .set('Accept', 'application/json');
            expect(status).toBe(200);
        });
    });

    describe('GET', () => {
        it('returns the list of translators announcements by search with filterName', async () => {
            const { body } = await supertest
                .agent(app.getHttpServer())
                .get('/translatorAnnouncements/search?field=tradutor de espanhol&filter=espanhol')
                .set('Accept', 'application/json');
            expect(body.result.length).toBe(2);
        });

        it('returns the list of translators announcements by search without filterName', async () => {
            const { body } = await supertest
                .agent(app.getHttpServer())
                .get('/translatorAnnouncements/search?field=tradutor de espanhol')
                .set('Accept', 'application/json');
            expect(body.result.length).toBe(1);
        });
    });

    afterAll(async () => {
        await repositoryTranslatorAnnouncement.query(`DELETE FROM contents WHERE id = '${id}'`);
        await app.close();
    });
});
