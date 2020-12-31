import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import TranslatorAnnouncement from './TranslatorAnnouncement.entity';
import { BaseCrudService } from '../base/base.service';

import data = require('data-search');

let datasetTranslator = [];

function findTranslators(translators) {
    datasetTranslator = data.dataSetGenerate({
        array: translators,
        wordSize: 2,
        nameId: 'id',
        attributes: ['title', 'subtitle', 'firstName', 'lastName', 'name']
    });
}

@Injectable()
export class TranslatorAnnouncementService extends BaseCrudService<TranslatorAnnouncement>{
    constructor(
        @InjectRepository(TranslatorAnnouncement)
        private repo: Repository<TranslatorAnnouncement>
    ) {
        super(repo, ['user', 'language']);
        this.generate(repo);
    }

    async searchAnnouncements(field: string, filterName: string): Promise<any[]> {
        data.setSearchDistance(0.1, 0.85);
        if (filterName) {
            return data.search(datasetTranslator, field, true, filterName);
        }
        return data.search(datasetTranslator, field, true);
    }

    async findAnnouncements(idUser: string) {
        const announcementsResponse = await this.repo.find({ relations: ['user'], where: { user: { id: idUser } } });
        return announcementsResponse;
    }

    async generate(repo: Repository<TranslatorAnnouncement>) {
        const translatorsResponse = await repo.find({ relations: ['user', 'language'] }).then(item => item);
        translatorsResponse.forEach(translator => translator.user.password = '');
        findTranslators(translatorsResponse);
        setInterval(async function () {
            const translatorsResponse = await repo.find({ relations: ['user', 'language'] }).then(item => item);
            translatorsResponse.forEach(translator => translator.user.password = '');
            findTranslators(translatorsResponse);
        }, 120000); // 2 min
    }

}
