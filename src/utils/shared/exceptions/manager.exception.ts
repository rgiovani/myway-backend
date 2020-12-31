import { ContentNotFound } from './contentNotFound.exception';
import { CourseNotFound } from './courseNotFound.exception';
import { StudentNotFound } from './studentNotFound.exception';
import { TeacherNotFound } from './teacherNotFound.exception';
import { UserNotFound } from './userNotFound.exception';

export function managerException<T>(obj: T, classType, id?) {

    if (obj != undefined) {
        return obj;
    }
    switch (classType.name) {
        case 'Student':
            throw new StudentNotFound(id);
        case 'User':
            throw new UserNotFound(id);
        case 'Course':
            throw new CourseNotFound(id);
        case 'Teacher':
            throw new TeacherNotFound(id);
        case 'Content':
            throw new ContentNotFound(id);
    }


}
