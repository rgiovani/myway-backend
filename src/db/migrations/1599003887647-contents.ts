import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from 'typeorm';

export class content1599003887647 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'content',
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
                        name: 'description',
                        type: 'varchar',
                        length: '110'
                    },
                    {
                        name: 'content_type',
                        type: 'varchar',
                        length: '15'
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

        //Course
        await queryRunner.addColumn('content', new TableColumn({
            name: 'course_id',
            type: 'varchar',
            length: '40'
        }));

        await queryRunner.createForeignKey('content', new TableForeignKey({
            columnNames: ['course_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'course',
            onDelete: 'CASCADE'
        }));

        //content
        await queryRunner.addColumn('content', new TableColumn({
            name: 'file_id',
            type: 'varchar',
            length: '40',
            isNullable: true
        }));

        await queryRunner.createForeignKey('content', new TableForeignKey({
            columnNames: ['file_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'file',
            onDelete: 'CASCADE'
        }));

        await queryRunner.createIndex('content', new TableIndex({
            name: 'content_NAME',
            columnNames: ['title']
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
            //Course
            const table = await queryRunner.getTable('course');
            const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('course_id') !== -1);
            await queryRunner.dropForeignKey('course', foreignKey);
            await queryRunner.dropColumn('course', 'course_id');
            await queryRunner.dropIndex('course', 'IDX_FILE_NAME');
            await queryRunner.dropTable('course');
    
            //content
            const table2 = await queryRunner.getTable('file');
            const foreignKey2 = table2.foreignKeys.find(fk => fk.columnNames.indexOf('file_id') !== -1);
            await queryRunner.dropForeignKey('file', foreignKey2);
            await queryRunner.dropColumn('file', 'file_id');
            await queryRunner.dropTable('content');
            await queryRunner.dropIndex('file', 'IDX_FILE_NAME');
            await queryRunner.dropTable('file');
    }

}
