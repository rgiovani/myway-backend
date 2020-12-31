import { LanguageModule } from './main/language/language.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import * as ormOptions from '../ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BaseCrudService } from './main/base/base.service';
import { CoursesModule } from './main/courses/courses.module';
import { StudentModule } from './main/student/student.module';
import { TeacherModule } from './main/teacher/teacher.module';
import { ContentModule } from './main/content/content.module';
import { TranslatorAnnouncementModule } from './main/translatorAnnouncement/translatorAnnouncement.module';
import { AuthModule } from './main/auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            expandVariables: true
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', 'files')
        }),
        TypeOrmModule.forRoot(ormOptions),
        StudentModule,
        CoursesModule,
        TeacherModule,
        TranslatorAnnouncementModule,
        ContentModule,
        LanguageModule,
        AuthModule
    ],
    controllers: [AppController],
    providers: [BaseCrudService, AppService]
})
export class AppModule { }
