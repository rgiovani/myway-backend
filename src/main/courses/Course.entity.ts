import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import AbstractEntity from '../../utils/shared/entities/AbstractEntity';
import Content from '../content/Content.entity';
import File from '../../utils/shared/entities/File.entity';
import Teacher from '../teacher/Teacher.entity';
import Language from '../language/language.entity';

/** Entity Course */
@Entity('course')
export default class Course extends AbstractEntity {

    @Column({ type: 'varchar', length: 120 })
    title: string;

    @Column({ type: 'varchar', length: 100 })
    subtitle: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @Column({ type: 'varchar', length: 150, name: 'student_prerequisites' })
    studentPrerequisites: string;

    @Column({ type: 'varchar', length: 150, name: 'student_targets' })
    studentTargets: string;

    @Column({ type: 'varchar', length: 150 })
    goals: string;

    @Column({ type: 'float', name: 'total_score' })
    totalScore: number;

    @Column({ type: 'varchar', length: 30 })
    level: string;

    @OneToMany(() => Language, language => language.course)
    language: Language[];

    @Column({ type: 'int', name: 'number_of_ratings' })
    numberOfRatings: number;

    @ManyToOne(() => Teacher, teacher => teacher.coursesTaught)
    @JoinColumn({ name: 'teacher_id' })
    teacher: Teacher;

    @OneToMany(() => Content, content => content.course)
    contents: Content[];

    @OneToOne(() => File, file => file.id)
    @JoinColumn({ name: 'image_course_id' })
    courseImage: File;

}
