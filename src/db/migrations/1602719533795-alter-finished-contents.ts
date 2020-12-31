import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class alterFinishedContents1602719533795 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('finished_content');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        await queryRunner.dropForeignKey('finished_content', foreignKey);
        await queryRunner.dropColumn('finished_content', 'user_id');

        await queryRunner.addColumn('finished_content', new TableColumn({
            name: 'student_id',
            type: 'varchar',
            length: '40'
        }));

        await queryRunner.createForeignKey('finished_content', new TableForeignKey({
            columnNames: ['student_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'student',
            onDelete: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable('finished_content');
    }

}
