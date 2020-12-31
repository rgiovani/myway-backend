import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import AbstractEntity from '../../utils/shared/entities/AbstractEntity';
import File from '../../utils/shared/entities/File.entity';
import User from '../../utils/shared/entities/User.entity';
import Course from '../courses/Course.entity';
import Rating from './Rating.entity';

/** Entity Teacher */
@Entity('teacher')
export default class Teacher extends AbstractEntity {
    @Column({ type: 'varchar', length: 255 })
    about: string;

    @Column({ type: 'varchar', length: 75 })
    specialty: string;

    @OneToOne(() => File)
    @JoinColumn({ name: 'profile_photo_Id' })
    profilePhoto: File;

    @OneToMany(() => Course, course => course.teacher)
    coursesTaught: Course[];

    @OneToOne(() => User, user => user.teacher)
    @JoinColumn({ name: 'id' })
    user: User;

    @OneToOne(() => Rating, rating => rating.id)
    @JoinColumn({ name: 'rating_id' })
    rating: Rating;

    @Column({ name: 'donation_link', nullable: true })
    donationLink: string;
}
