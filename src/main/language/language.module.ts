import { LanguageService } from './language.service';
import { Module } from '@nestjs/common';
import { LanguageController } from './language.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Language from './language.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Language])],
    controllers: [LanguageController],
    providers: [LanguageService]
})
export class LanguageModule { }
