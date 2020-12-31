import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import AbstractEntity from '../../utils/shared/entities/AbstractEntity';
import Course from '../courses/Course.entity';
import TranslatorAnnouncement from '../translatorAnnouncement/TranslatorAnnouncement.entity';

/** Entity language */
@Entity('language')
export default class Language extends AbstractEntity {
    @Column({ type: 'varchar', length: 30 })
    name: string;

    @ManyToOne(() => TranslatorAnnouncement, translatorAnnouncements => translatorAnnouncements.language)
    @JoinColumn({ name: 'announcement_id' })
    translatorAnnouncements: TranslatorAnnouncement;

    @ManyToOne(() => Course, course => course.language)
    @JoinColumn({ name: 'course_id' })
    course: Course;
}
