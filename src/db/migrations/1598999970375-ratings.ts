import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex} from 'typeorm';

export class rating1598999970375 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'rating',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        length: '40',
                        isPrimary: true,
                        generationStrategy: 'uuid'
                    },
                    {
                        name: 'total_score',
                        type: 'float'
                    },
                    {
                        name: 'number_of_ratings',
                        type: 'int'
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

            await queryRunner.addColumn('rating', new TableColumn({
                name: 'teacher_id',
                type: 'varchar',
                length: '40'
            }));
    
            await queryRunner.createForeignKey('rating', new TableForeignKey({
                columnNames: ['teacher_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE'
            }));

            await queryRunner.createIndex('rating', new TableIndex({
                name: 'IDX_rating_NAME',
                columnNames: ['id']
            }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('user');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('teacher_id') !== -1);
        await queryRunner.dropForeignKey('user', foreignKey);
        await queryRunner.dropColumn('user', 'teacher_id');
        await queryRunner.dropTable('rating');
        await queryRunner.dropIndex('user', 'IDX_FILE_NAME');
        await queryRunner.dropTable('user');
    }

}
