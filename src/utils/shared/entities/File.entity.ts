import { Column, Entity } from 'typeorm';
import AbstractEntity from './AbstractEntity';

/** Entity File */
@Entity('file')
export default class File extends AbstractEntity {

    @Column({ type: 'varchar', length: 100, name: 'old_name' })
    oldName: string;

    @Column({ type: 'varchar', length: 100, name: 'new_name' })
    newName: string;

    @Column({ type: 'varchar', length: 20 })
    format: string;

    @Column({ type: 'varchar', length: 120 })
    link: string;

}
