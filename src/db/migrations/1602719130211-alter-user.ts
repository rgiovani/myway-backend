import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class alterUser1602719130211 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropColumn('user', 'specialty');
        queryRunner.dropColumn('user', 'user_type');
        queryRunner.dropColumn('user', 'about');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable('user');
    }

}
