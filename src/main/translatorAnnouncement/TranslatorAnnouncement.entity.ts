import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import AbstractEntity from '../../utils/shared/entities/AbstractEntity';
import User from '../../utils/shared/entities/User.entity';
import Language from '../language/language.entity';

/** Entity TranslatorAnnouncement */
@Entity('translator_announcement')
export default class TranslatorAnnouncement extends AbstractEntity {

    @Column({ type: 'varchar', length: 150 })
    title: string;

    @Column({ type: 'varchar', length: 150 })
    subtitle: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @Column({ type: 'float' })
    price: number;

    @Column({ type: 'varchar', length: 12 })
    phone: string;

    @ManyToOne(() => User, commonUser => commonUser.announcements)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Language, language => language.translatorAnnouncements)
    language: Language[];

}


