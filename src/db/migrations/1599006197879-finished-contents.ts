import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableColumn } from 'typeorm';

export class finishedcontents1599006197879 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'finished_content',
                columns: [
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


        await queryRunner.addColumn('finished_content', new TableColumn({
            name: 'user_id',
            type: 'varchar',
            length: '40'
        }));

        await queryRunner.createForeignKey('finished_content', new TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE'
        }));

        await queryRunner.addColumn('finished_content', new TableColumn({
            name: 'content_id',
            type: 'varchar',
            length: '40'
        }));

        await queryRunner.createForeignKey('finished_content', new TableForeignKey({
            columnNames: ['content_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'content',
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
     const table2 = await queryRunner.getTable('content');
     const foreignKey2 = table2.foreignKeys.find(fk => fk.columnNames.indexOf('content_id') !== -1);
     await queryRunner.dropForeignKey('content', foreignKey2);
     await queryRunner.dropColumn('content', 'content_id');
     await queryRunner.dropTable('finished_content');
     await queryRunner.dropIndex('content', 'IDX_FILE_NAME');
     await queryRunner.dropTable('content');
    }

}
