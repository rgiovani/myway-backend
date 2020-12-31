import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { TypeContent } from '../../utils/enums/TypeContent';
import AbstractEntity from '../../utils/shared/entities/AbstractEntity';
import Course from '../courses/Course.entity';
import File from '../../utils/shared/entities/File.entity';

/** Entity Content */
@Entity('content')
export default class Content extends AbstractEntity {
    @Column({ type: 'varchar', length: 120 })
    title: string;

    @Column({ type: 'varchar', length: 100, name: 'content_type' })
    contentType: TypeContent;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @ManyToOne(() => Course, course => course.contents)
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @Column()
    link: string;

    @OneToOne(() => File, file => file.id)
    @JoinColumn({ name: 'file_id' })
    file: File;

}
