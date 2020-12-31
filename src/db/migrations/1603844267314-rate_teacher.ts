import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class rateTeacher1603844267314 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'rate_teacher',
                columns: [
                    {
                        name: 'isRated',
                        type: 'tinyint',
                        default: 0
                    },
                    {
                        name: 'score',
                        type: 'int',
                        default: 0
                    }
                ]
            }), true);

        await queryRunner.addColumn('rate_teacher', new TableColumn({
            name: 'student_id',
            type: 'varchar',
            length: '40'
        }));

        await queryRunner.createForeignKey('rate_teacher', new TableForeignKey({
            columnNames: ['student_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'student',
            onDelete: 'CASCADE'
        }));

        await queryRunner.addColumn('rate_teacher', new TableColumn({
            name: 'teacher_id',
            type: 'varchar',
            length: '40'
        }));

        await queryRunner.createForeignKey('rate_teacher', new TableForeignKey({
            columnNames: ['teacher_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'teacher',
            onDelete: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //Student
        const table = await queryRunner.getTable('student');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('student_id') !== -1);
        await queryRunner.dropForeignKey('student', foreignKey);
        await queryRunner.dropColumn('student', 'student_id');
        await queryRunner.dropIndex('student', 'IDX_FILE_NAME');
        await queryRunner.dropTable('student');

        //Teacher
        const table2 = await queryRunner.getTable('teacher');
        const foreignKey2 = table2.foreignKeys.find(fk => fk.columnNames.indexOf('teacher_id') !== -1);
        await queryRunner.dropForeignKey('teacher', foreignKey2);
        await queryRunner.dropColumn('teacher', 'teacher_id');
        await queryRunner.dropTable('user_teacher');
        await queryRunner.dropIndex('teacher', 'IDX_FILE_NAME');
        await queryRunner.dropTable('teacher');
    }

}
