import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class studentCourse1603753025651 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user_course');

        await queryRunner.createTable(
            new Table({
                name: 'student_course',
                columns: [
                    {
                        name: 'finished',
                        type: 'tinyint',
                        default: 0
                    },
                    {
                        name: 'isRated',
                        type: 'boolean',
                        default: false
                    },
                    {
                        name: 'score',
                        type: 'numeric',
                        default: 0
                    }
                ]
            }), true);
            // await queryRunner.addColumn('user_course', new TableColumn({
            //     name: 'isRated',
            //     type: 'boolean',
            //     default: false
            // }));
            // await queryRunner.addColumn('user_course', new TableColumn({
            //     name: 'rating',
            //     type: 'numeric'
            // }));
        await queryRunner.addColumn('student_course', new TableColumn({
            name: 'student_id',
            type: 'varchar',
            length: '40'
        }));

        await queryRunner.createForeignKey('student_course', new TableForeignKey({
            columnNames: ['student_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'student',
            onDelete: 'CASCADE'
        }));

        await queryRunner.addColumn('student_course', new TableColumn({
            name: 'course_id',
            type: 'varchar',
            length: '40'
        }));

        await queryRunner.createForeignKey('student_course', new TableForeignKey({
            columnNames: ['course_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'course',
            onDelete: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
