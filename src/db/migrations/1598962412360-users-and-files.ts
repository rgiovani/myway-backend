import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey, Table, TableIndex} from 'typeorm';

export class userAndfile1598962412360 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'file',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        length: '40',
                        isPrimary: true,
                        generationStrategy: 'uuid'
                    },
                    {
                        name: 'old_name',
                        type: 'varchar',
                        length: '100'
                    },
                    {
                        name: 'new_name',
                        type: 'varchar',
                        length: '100'
                    },
                    {
                        name: 'format',
                        type: 'varchar',
                        length: '20'
                    },
                    {
                        name: 'link',
                        type: 'varchar',
                        length: '120'
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

        await queryRunner.createIndex('file', new TableIndex({
            name: 'IDX_file_NAME',
            columnNames: ['old_name']
        }));


        await queryRunner.createTable(
            new Table({
                name: 'user',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        length: '40',
                        isPrimary: true,
                        generationStrategy: 'uuid'
                    },
                    {
                        name: 'first_name',
                        type: 'varchar',
                        length: '50'

                    },
                    {
                        name: 'last_name',
                        type: 'varchar',
                        length: '50'

                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        length: '75'

                    },
                    {
                        name: 'password',
                        type: 'varchar',
                        length: '65'

                    },
                    {
                        name: 'user_type',
                        type: 'varchar',
                        length: '25'

                    },
                    {
                        name: 'about',
                        type: 'varchar',
                        length: '255',
                        isNullable: true
                    },
                    {
                        name: 'specialty',
                        type: 'varchar',
                        length: '75',
                        isNullable: true
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

        await queryRunner.addColumn('user', new TableColumn({
            name: 'profile_photo_Id',
            type: 'varchar',
            length: '40',
            isNullable: true
        }));

        await queryRunner.createForeignKey('user', new TableForeignKey({
            columnNames: ['profile_photo_Id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'file',
            onDelete: 'CASCADE'
        }));

        await queryRunner.createIndex('user', new TableIndex({
            name: 'IDX_user_NAME',
            columnNames: ['first_name']
        }));


    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('file');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('profile_photo_Id') !== -1);
        await queryRunner.dropForeignKey('file', foreignKey);
        await queryRunner.dropColumn('file', 'profile_photo_Id');
        await queryRunner.dropTable('user');
        await queryRunner.dropIndex('file', 'IDX_FILE_NAME');
        await queryRunner.dropTable('file');
    }

}
