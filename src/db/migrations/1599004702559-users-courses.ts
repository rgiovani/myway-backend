import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, Table } from 'typeorm';

export class usercourse1599004702559 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'user_course',
                columns: [
                    {
                        name: 'finished',
                        type: 'tinyint',
                        default: 0
                    }
                ]
            }), true);

        await queryRunner.addColumn('user_course', new TableColumn({
            name: 'user_id',
            type: 'varchar',
            length: '40'
        }));

        await queryRunner.createForeignKey('user_course', new TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE'
        }));

        await queryRunner.addColumn('user_course', new TableColumn({
            name: 'course_id',
            type: 'varchar',
            length: '40'
        }));

        await queryRunner.createForeignKey('user_course', new TableForeignKey({
            columnNames: ['course_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'course',
            onDelete: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //User
        const table = await queryRunner.getTable('user');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        await queryRunner.dropForeignKey('user', foreignKey);
        await queryRunner.dropColumn('user', 'user_id');
        await queryRunner.dropIndex('user', 'IDX_FILE_NAME');
        await queryRunner.dropTable('user');

        //Curso
        const table2 = await queryRunner.getTable('file');
        const foreignKey2 = table2.foreignKeys.find(fk => fk.columnNames.indexOf('course_id') !== -1);
        await queryRunner.dropForeignKey('course', foreignKey2);
        await queryRunner.dropColumn('course', 'course_id');
        await queryRunner.dropTable('user_course');
        await queryRunner.dropIndex('course', 'IDX_FILE_NAME');
        await queryRunner.dropTable('course');
    }

}
