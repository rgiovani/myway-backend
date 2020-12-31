import { Controller, Get } from '@nestjs/common';
import { BaseCrudController } from '../base/base.controller';
import Language from './language.entity';
import { LanguageService } from './language.service';

@Controller('languages')
export class LanguageController extends BaseCrudController<Language>{
    constructor(private readonly languageService: LanguageService) {
        super(languageService);
    }

    @Get('translators')
    async getLanguageByTranslatorsInsert() {
        return this.languageService.findLanguages('translatorAnnouncements');
    }

    @Get('courses')
    async getLanguageByCoursesInsert() {
        return this.languageService.findLanguages('course');
    }
}
