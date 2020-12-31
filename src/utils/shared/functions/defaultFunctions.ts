import stringSimilarity = require('string-similarity');
import natural = require('natural');
import Course from 'src/main/courses/Course.entity';
import { join } from 'path';
import { unlink } from 'fs';
const tokenizer = new natural.WordTokenizer();


/** * This function remove special characters. 
 ** Tokenize(true): Split strings into an array for each word. */
export function treatString(text: string, tokenize: boolean) {
    text = this.removeSpecialCharactersInString(text.toLowerCase());
    if (tokenize) {
        return this.removeRedundancyFromStringArray(tokenizer.tokenize(text));
    }
    return text;
}

/** * This function remove special characters from string*/
export function removeSpecialCharactersInString(text: string) {
    text = text.replace('ç', 'c').replace('ê', 'e')
        .replace('é', 'e').replace('á', 'a')
        .replace('ã', 'a').replace('â', 'a');
    return text;
}

/** * This function remove duplicate words in array of strings */
export function removeRedundancyFromStringArray(token: string[]) {
    const newToken: string[] = [];
    token.forEach(word => {
        if (!newToken.includes(word.toLowerCase()) && word.length > 2) {
            newToken.push(word.toString().toLowerCase());
        }
    });
    return newToken;
}

//** This function to compare two strings based on the similar value between them * /
export function similarStrings(text: string, tags: string[], similarValue: number) {
    tags = removeRedundancyFromStringArray(tags);
    const matches = stringSimilarity.findBestMatch(text, tags);
    for (const i in matches.ratings) {
        if (matches.ratings[i].rating > similarValue) {
            return true;
        }
    }
    return false;
}

//** This function make plural strings become singular */
export function makeStringSingular(word: string) {
    const verbInflector = new natural.PresentVerbInflector();
    verbInflector.pluralize(word);
}

//** This function orders a course array*/
export function sortArrayOfCourse(array: Course[], sort: number) {
    let val;
    if (sort == 1) {
        val = array.sort((a, b) => (a.totalScore > b.totalScore) ? 1 : -1);
    } else {
        val = array.sort((a, b) => (a.totalScore > b.totalScore) ? -1 : 1);
    }
    return val;
}

//** This function returns the current system time in string format*/
export function getCurrentTimeString() {
    const date = new Date();
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}

export function removeLocalFile(fileName) {
    // let pathString = '';
    // paths.forEach(p => {
    //     pathString += p + '/';
    // });
    // let directory = join(__dirname, pathString);

    // if (!directory.includes('backend')) {
    //     directory = join(__dirname, pathString);
    // }
    unlink('./files/' + fileName, error => {
        if (error) {
            console.error(error);
        }
    });
}