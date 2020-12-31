import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from 'typeorm';

export class courses1599002521370 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'course',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        length: '40',
                        isPrimary: true,
                        generationStrategy: 'uuid'
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        length: '120'
                    },
                    {
                        name: 'subtitle',
                        type: 'varchar',
                        length: '100'
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                        length: '255'
                    },
                    {
                        name: 'student_prerequisites',
                        type: 'varchar',
                        length: '150'
                    },
                    {
                        name: 'student_targets',
                        type: 'varchar',
                        length: '150'
                    },
                    {
                        name: 'total_score',
                        type: 'float'
                    },
                    {
                        name: 'level',
                        type: 'varchar',
                        length: '30'
                    },
                    {
                        name: 'language',
                        type: 'varchar',
                        length: '30'
                    },
                    {
                        name: 'number_of_ratings',
                        type: 'int'
                    },
                    {
                        name: 'goals',
                        type: 'varchar',
                        length: '255'
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()'
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()'
                    }

                ]
            }), true);

        //Image
        await queryRunner.addColumn('course', new TableColumn({
            name: 'image_course_id',
            type: 'varchar',
            length: '40'
        }));

        await queryRunner.createForeignKey('course', new TableForeignKey({
            columnNames: ['image_course_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'file',
            onDelete: 'CASCADE'
        }));

        //Teacher
        await queryRunner.addColumn('course', new TableColumn({
            name: 'teacher_id',
            type: 'varchar',
            length: '40'
        }));

        await queryRunner.createForeignKey('course', new TableForeignKey({
            columnNames: ['teacher_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE'
        }));

        await queryRunner.createIndex('course', new TableIndex({
            name: 'IDX_course_NAME',
            columnNames: ['title']
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //Image
        const table = await queryRunner.getTable('file');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('image_course_id') !== -1);
        await queryRunner.dropForeignKey('file', foreignKey);
        await queryRunner.dropColumn('file', 'image_course_id');
        await queryRunner.dropIndex('file', 'IDX_FILE_NAME');
        await queryRunner.dropTable('file');

        //Teacher
        const table2 = await queryRunner.getTable('user');
        const foreignKey2 = table2.foreignKeys.find(fk => fk.columnNames.indexOf('teacher_id') !== -1);
        await queryRunner.dropForeignKey('user', foreignKey2);
        await queryRunner.dropColumn('user', 'teacher_id');
        await queryRunner.dropTable('course');
        await queryRunner.dropIndex('user', 'IDX_FILE_NAME');
        await queryRunner.dropTable('user');

    }

}
