import { treatString } from '../../../utils/shared/functions/defaultFunctions';

export default class DataSet {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    studentPrerequisites: string;
    studentTargets: string;
    goals: string;
    level: string;
    language: string;
    numberOfRatings: number;
    teacherFirstName: string;
    teacherLastName: string;
    totalSearchesFound: number;
    tags: string[] = [];

    constructor(course) {
        if (course) {
            this.id = course.id;
            this.title = course.title;
            this.subtitle = course.subtitle;
            this.language = course.language;
            this.level = course.level.toString();
            this.studentPrerequisites = course.studentPrerequisites;
            this.studentTargets = course.studentTargets;
            this.teacherFirstName = course.teacher.user.firstName;
            this.teacherLastName = course.teacher.user.lastName;
            this.totalSearchesFound = 0;
            this.fillTags(course.title, this);
            this.fillTags(course.subtitle, this);
            this.fillTags(course.description, this);
            this.fillTags(course.studentPrerequisites, this);
            this.fillTags(course.studentTargets, this);
            this.fillTags(course.language, this);
            this.fillTags(course.level.toString(), this);
            this.fillTags(course.teacher.user.firstName, this);
            this.fillTags(course.teacher.user.lastName, this);
        }
    }

    private fillTags(field: string, newData: DataSet) {
        field = (field) ? field : '';
        let wordsArray: string[] = [];
        wordsArray = treatString(field, true);
        wordsArray.forEach(word => {
            if (!newData.tags.includes(word.toLowerCase()) && word.length > 3) {
                newData.tags.push(word.toString().toLowerCase());
            }
        });
    }
}
