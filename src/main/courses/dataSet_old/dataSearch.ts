import * as DefaultFunctions from '../../../utils/shared/functions/defaultFunctions';
import * as dataSetGenerate from './dataSetGenerate';
import stringSimilarity = require('string-similarity');
import natural = require('natural');

const metaphone = natural.Metaphone;

function findSimilarMatches(input: string[], tags: string[]) {
    const getSimilar = [];
    input.forEach(word => {
        const matches = stringSimilarity.findBestMatch(word, tags);
        for (const i in matches.ratings) {
            if (matches.ratings[i].rating > 0.85) {
                getSimilar.push(matches.ratings[i].target);
            } else if (matches.ratings[i].rating > 0.55) {
                getSimilar.push(matches.ratings[i].target);
            }
        }
    });
    return getSimilar;
}

function fillArrayOfIds(idsFounded: string[], highestValue: number) {
    if (highestValue != 0) {
        dataSetGenerate.dataSet.forEach(course => {
            (course.totalSearchesFound === highestValue) ? idsFounded.push(course.id) : false;
            course.totalSearchesFound = 0;
        });
        idsFounded = DefaultFunctions.removeRedundancyFromStringArray(idsFounded);
        return idsFounded;
    }
}

function getCourseBySimilarIds(ids: string[], sort: number) {
    const coursesFound = [];
    let response = [];
    if (ids != undefined) {
        dataSetGenerate.dataBaseCourse.forEach(course => {
            ids.forEach(id => {
                (course.id == id) ? coursesFound.push(course) : false;
            });
        });
        response = DefaultFunctions.sortArrayOfCourse(coursesFound, sort);
    }
    return response;
}

export function dataSearch(field: string, sort: number) {
    if (field) {
        let mainInfoFromCourse = [];
        let similarsWords = [];
        const similarIds = { message: 'OK', ids: [] };
        const idsFound = [];
        let foundInMainInfo = 0;
        let highestValue = 0;
        const arrayInput: string[] = DefaultFunctions.treatString(field, true);

        dataSetGenerate.dataSet.forEach(course => {
            similarsWords = findSimilarMatches(arrayInput, course.tags);
            if (similarsWords[0] !== undefined) {
                similarsWords.forEach(word => {
                    course.tags.forEach(tag => {
                        if (metaphone.compare(tag, word)) {
                            mainInfoFromCourse = [];
                            mainInfoFromCourse.push(course.language);
                            if (DefaultFunctions.similarStrings(word.toString(), mainInfoFromCourse, 0.95)) {
                                idsFound.push(course.id);
                                foundInMainInfo++;
                            }
                            course.totalSearchesFound++;
                        }
                    });
                    highestValue = (course.totalSearchesFound > highestValue) ? course.totalSearchesFound : highestValue;
                });
            }
        });
        similarIds.message = (foundInMainInfo == 0) ? 'I didn\'t find what you searched for, but I found:' : 'OK';
        similarIds.ids = fillArrayOfIds(idsFound, highestValue);
        return getCourseBySimilarIds(similarIds.ids, sort);

    } else {
        return DefaultFunctions.sortArrayOfCourse(dataSetGenerate.dataBaseCourse, sort);
    }
}