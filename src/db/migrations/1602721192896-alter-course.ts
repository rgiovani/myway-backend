import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from 'typeorm';

export class alterCourse1602721192896 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('course');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('teacher_id') !== -1);
        await queryRunner.dropForeignKey('course', foreignKey);
        await queryRunner.dropColumn('course', 'teacher_id');

        await queryRunner.addColumn('course', new TableColumn({
            name: 'teacher_id',
            type: 'varchar',
            length: '40'
        }));

        await queryRunner.createForeignKey('course', new TableForeignKey({
            columnNames: ['teacher_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'teacher',
            onDelete: 'CASCADE'
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
