import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterRating1602721354354 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('rating');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('teacher_id') !== -1);
        await queryRunner.dropForeignKey('rating', foreignKey);
        await queryRunner.dropColumn('rating', 'teacher_id');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable('rating');
    }

}
