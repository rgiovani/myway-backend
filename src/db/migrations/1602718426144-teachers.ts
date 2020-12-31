import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class teachers1602718426144 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'teacher',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        length: '40',
                        isPrimary: true,
                        generationStrategy: 'uuid'
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()'
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
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()'
                    }
                ]
            }), true);


        await queryRunner.createForeignKey('teacher', new TableForeignKey({
            columnNames: ['id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            // onDelete: 'CASCADE',
            // onUpdate: 'CASCADE'
        }));

        await queryRunner.addColumn('teacher', new TableColumn({
            name: 'profile_photo_Id',
            type: 'varchar',
            length: '40',
            isNullable: true
        }));

        await queryRunner.createForeignKey('teacher', new TableForeignKey({
            columnNames: ['profile_photo_Id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'file',
            onDelete: 'CASCADE'
        }));

        await queryRunner.addColumn('teacher', new TableColumn({
            name: 'rating_id',
            type: 'varchar',
            length: '40',
            isNullable: true
        }));

        await queryRunner.createForeignKey('teacher', new TableForeignKey({
            columnNames: ['rating_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'rating',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable('teacher');
    }

}
