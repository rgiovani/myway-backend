import Course from 'src/main/courses/Course.entity';
import DataSet from './DataSet';
import { Repository } from 'typeorm';

let updateCount = 0;
export let dataSet = [];
export let dataBaseCourse: Course[] = [];

function dataGenerate(repo: Course[]) {
    dataSet = [];
    dataBaseCourse = [];
    repo.forEach(course => {
        dataBaseCourse.push(course);
        dataSet.push(new DataSet(course));
    });
}

export async function generate(repo: Repository<Course>) {
    dataGenerate(await repo.find({ relations: ['teacher', 'courseImage', 'teacher.user'] }).then(item => item));
    updateCount++;
}
