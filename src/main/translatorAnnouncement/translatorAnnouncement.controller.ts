import { ClassSerializerInterceptor, Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import TranslatorAnnouncement from './TranslatorAnnouncement.entity';
import { BaseCrudController } from '../base/base.controller';
import { TranslatorAnnouncementService } from './translatorAnnouncement.service';


@Controller('translatorAnnouncements')
export class TranslatorAnnouncementController extends BaseCrudController<TranslatorAnnouncement>  {
    constructor(private readonly service: TranslatorAnnouncementService) {
        super(service);
    }

    @Get('search')
    @UseInterceptors(ClassSerializerInterceptor)
    async getSearchAnnouncements(@Query('field') field: string, @Query('filter') filterName: string) {
        return this.service.searchAnnouncements(field, filterName);
    }

    @Get('user/:idUser')
    @UseInterceptors(ClassSerializerInterceptor)
    async getAnnouncementsByUser(@Param('idUser') idUser: string) {
        return this.service.findAnnouncements(idUser);
    }

}
