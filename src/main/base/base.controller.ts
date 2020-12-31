import { Body, ClassSerializerInterceptor, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BaseEntity } from 'typeorm';
import { IBaseCrudService } from './interfaces/IBase.service';

export class BaseCrudController<T extends BaseEntity> {
    constructor(private readonly IBaseService: IBaseCrudService<T>) { }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async getAll(): Promise<T[]> {
        return this.IBaseService.findAll();
    }

    @Post()
    async create(@Body() entity: T): Promise<T> {
        return this.IBaseService.create(entity);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() entity: T): Promise<any> {
        return this.IBaseService.update(id, entity);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<any> {
        await this.IBaseService.findById(id);
        return this.IBaseService.delete(id);
    }

    @Get(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    async getById(@Param('id') id: string): Promise<T> {
        return this.IBaseService.findById(id);
    }
    
}
