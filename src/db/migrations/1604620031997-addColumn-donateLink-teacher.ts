import {MigrationInterface, QueryRunner, TableColumn} from 'typeorm';

export class addColumnDonateLinkTeacher1604620031997 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('teacher', new TableColumn({
            name: 'donation_link',
            type: 'varchar',
            length: '100',
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('teacher', 'donation_link');
    }

}
