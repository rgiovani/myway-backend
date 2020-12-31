import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableColumn, TableIndex } from 'typeorm';

export class translatorAnnouncement1599001871284 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'translator_announcement',
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
                        length: '150'
                    },
                    {
                        name: 'subtitle',
                        type: 'varchar',
                        length: '150'
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                        length: '255'
                    },
                    {
                        name: 'price',
                        type: 'float'
                    },
                    {
                        name: 'phone',
                        type: 'varchar',
                        length: '12'
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

        await queryRunner.addColumn('translator_announcement', new TableColumn({
            name: 'user_id',
            type: 'varchar',
            length: '40'
        }));

        await queryRunner.createForeignKey('translator_announcement', new TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE'
        }));

        await queryRunner.createIndex('translator_announcement', new TableIndex({
            name: 'IDX_TRANSLATOR_ANNOUNCEMENT_NAME',
            columnNames: ['title']
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('user');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('teacher_id') !== -1);
        await queryRunner.dropForeignKey('user', foreignKey);
        await queryRunner.dropColumn('user', 'profile_photo_Id');
        await queryRunner.dropTable('translator_announcement');
        await queryRunner.dropIndex('user', 'IDX_FILE_NAME');
        await queryRunner.dropTable('user');
    }

}
