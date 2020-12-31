import { Column, Entity } from 'typeorm';
import AbstractEntity from '../../utils/shared/entities/AbstractEntity';

/** Entity Rating */
@Entity('rating')
export default class Rating extends AbstractEntity {

    @Column({ type: 'float', name: 'total_score' })
    totalScore: number;

    @Column({ type: 'float', name: 'number_of_ratings' })
    numberOfRatings: number;

}
