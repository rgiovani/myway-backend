import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Student from '../student/Student.entity';
import TranslatorAnnouncement from './TranslatorAnnouncement.entity';
import { TranslatorAnnouncementController } from './translatorAnnouncement.controller';
import { TranslatorAnnouncementService } from './translatorAnnouncement.service';

@Module({
    imports: [TypeOrmModule.forFeature([TranslatorAnnouncement, Student])],
    controllers: [TranslatorAnnouncementController],
    providers: [TranslatorAnnouncementService]
})
export class TranslatorAnnouncementModule { }
