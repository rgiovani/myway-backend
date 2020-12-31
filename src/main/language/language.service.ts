import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../base/base.service';
import Language from './language.entity';

const languageArray = [];


async function fillLanguagesArray(languages) {
    languages.forEach(language => {
        if (language.translatorAnnouncements) {
            languageArray.push({
                name: language.name,
                translatorAnnouncements: language.translatorAnnouncements
            });
        } else if (language.course) {
            languageArray.push({
                name: language.name,
                course: language.course
            });
        }
    });
}

@Injectable()
export class LanguageService extends BaseCrudService<Language>{
    constructor(
        @InjectRepository(Language)
        private repo: Repository<Language>
    ) {
        super(repo, []);
        this.getAllLanguages(repo);
    }

    async findLanguages(type: string) {
        return this.findBy(type.toString());
    }

    async findBy(type: string) {
        const tmp = [];

        for (let index = 0; index < languageArray.length; index++) {

            await this.repo.findAndCount({
                where: {
                    name: languageArray[index].name,
                    [type.toString()]: languageArray[index][type.toString()]
                }

            }).then(countLanguagesArray => {
                const obj = { name: '', size: 0 };
                countLanguagesArray.forEach(index => {
                    if (Array.isArray(index)) {
                        index.forEach(language => {
                            if (obj.name === language.name) {
                                obj.size++;
                            } else {
                                obj.name = language.name;
                                obj.size++;
                            }
                            let found = false;
                            tmp.forEach(item => {
                                if (item.name === obj.name) {
                                    // item.size++;
                                    found = true;
                                }
                            });
                            (!found) && tmp.push(obj);

                        });

                    }
                });

            });
        }
        return tmp;
    }





    async getAllLanguages(repo: Repository<Language>) {
        fillLanguagesArray(await repo.find({ relations: ['translatorAnnouncements', 'course'] }).then(item => item));
        setInterval(async function () {
            fillLanguagesArray(await repo.find({ relations: ['translatorAnnouncements', 'course'] }).then(item => item));
        }, 120000); // 2 min
    }
}
