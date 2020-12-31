import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Repository } from 'typeorm';
import Teacher from '../../teacher/Teacher.entity';
import { StudentModule } from '../student.module';
import supertest = require('supertest');
import { removeLocalFile } from '../../../utils/shared/functions/defaultFunctions';

describe('Become teacher', () => {
    let app: INestApplication;
    let repositoryTeacher: Repository<Teacher>;
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
        repositoryTeacher = module.get('TeacherRepository');
        await repositoryTeacher.query('DELETE FROM teacher WHERE id=\'9008a0ef-fdff-4cea-9884-8cf5bc91c8ee\';');
        await app.init();
    });
    describe('PUT /students/:id/become-teacher', () => {
        it('should return status 200 if the user is not teacher', async () => {
            const { status } = await supertest
                .agent(app.getHttpServer())
                .put('/students/9008a0ef-fdff-4cea-9884-8cf5bc91c8ee/become-teacher')
                .set('Content-Type', 'multipart/form-data')
                .attach('profilePhoto', join(__dirname, '/', 'img5.png'))
                .field('firstName', 'Joao')
                .field('lastName', 'Carlos')
                .field('email', 'contatomeuemail@email.com')
                .field('specialty', 'Sou especialista em Ingles')
                .field('donationLink', 'https://www.paypal.com/br/home')
                .field('about', 'Sou professor de ingles e alemao');
            expect(status).toBe(200);
        });
    });

    afterAll(async () => {
        const teacher = await repositoryTeacher.findOne('9008a0ef-fdff-4cea-9884-8cf5bc91c8ee', { relations: ['profilePhoto'] });
        removeLocalFile(teacher.profilePhoto?.newName);
        await repositoryTeacher.query('DELETE FROM teacher WHERE id=\'9008a0ef-fdff-4cea-9884-8cf5bc91c8ee\';');
        await app.close();
    });

});
