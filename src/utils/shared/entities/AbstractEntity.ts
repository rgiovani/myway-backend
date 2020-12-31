import { CreateDateColumn, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

/** Abstract class of attributes communs */
export default abstract class AbstractEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @CreateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}
