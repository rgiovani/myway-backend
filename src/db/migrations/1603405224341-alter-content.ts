import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterContent1603405224341 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('content', new TableColumn({
            name: 'link',
            type: 'varchar',
            isNullable: true,
            length: '255'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable('content');
    }

}
