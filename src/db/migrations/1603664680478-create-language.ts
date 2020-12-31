import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class createLanguage1603664680478 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropColumn('course', 'language');
        await queryRunner.createTable(
            new Table({
                name: 'language',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        length: '40',
                        isPrimary: true,
                        generationStrategy: 'uuid'
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '30'
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

        await queryRunner.addColumn('language', new TableColumn({
            name: 'announcement_id',
            type: 'varchar',
            length: '40',
            isNullable: true
        }));

        await queryRunner.createForeignKey('language', new TableForeignKey({
            columnNames: ['announcement_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'translator_announcement',
            onDelete: 'CASCADE'
        }));

        await queryRunner.addColumn('language', new TableColumn({
            name: 'course_id',
            type: 'varchar',
            length: '40',
            isNullable: true
        }));

        await queryRunner.createForeignKey('language', new TableForeignKey({
            columnNames: ['course_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'course',
            onDelete: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable('language');
    }

}
