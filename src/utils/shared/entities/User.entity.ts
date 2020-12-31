import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import Student from '../../../main/student/Student.entity';
import Teacher from '../../../main/teacher/Teacher.entity';
import TranslatorAnnouncement from '../../../main/translatorAnnouncement/TranslatorAnnouncement.entity';
import AbstractEntity from './AbstractEntity';

/** Entity user */
@Entity('user')
export default class User extends AbstractEntity {

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 50, name: 'first_name' })
    firstName: string;

    @Column({ type: 'varchar', length: 50, name: 'last_name' })
    lastName: string;

    @IsEmail()
    @Column({ type: 'varchar', length: 75 })
    email: string;

    @Column({ type: 'varchar', length: 65 })
    @Exclude()
    password: string;

    @OneToOne(() => Student, student => student.user)
    student: Student;

    @OneToOne(() => Teacher, teacher => teacher.user)
    teacher: Teacher;

    @OneToMany(() => TranslatorAnnouncement, announcement => announcement.user)
    announcements: TranslatorAnnouncement[];
}
