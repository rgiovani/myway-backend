import User from '../../utils/shared/entities/User.entity';
import { Entity, JoinColumn, JoinTable, ManyToMany, OneToOne } from 'typeorm';
import AbstractEntity from '../../utils/shared/entities/AbstractEntity';
import Content from '../content/Content.entity';
import Course from '../courses/Course.entity';

/** Entity Student */
@Entity('student')
export default class Student extends AbstractEntity {

    @ManyToMany(() => Course)
    @JoinTable({
        name: 'student_course',
        joinColumn: {
            name: 'student_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'course_id',
            referencedColumnName: 'id'
        }
    })
    enrolledCourses: Course[];

    @ManyToMany(() => Content)
    @JoinTable({
        name: 'finished_content',
        joinColumn: {
            name: 'student_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'content_id',
            referencedColumnName: 'id'
        }
    })
    finishedContents: Content[];

    @OneToOne(() => User, user => user.student)
    @JoinColumn({ name: 'id' })
    user: User;
}
