import { BadRequestException, NotFoundException } from '@nestjs/common';
import { validate } from 'class-validator';
import { BaseEntity, Repository } from 'typeorm';
import { IBaseCrudService } from './interfaces/IBase.service';

export class BaseCrudService<T extends BaseEntity> implements IBaseCrudService<T> {
    constructor(
        private readonly genericRepository: Repository<T>,
        private relations: string[]
    ) { }

    async create(entity: any): Promise<T> {
        const response = this.genericRepository.create(entity);
        const errors = await validate(response);
        if (errors.length > 0) {
            throw new BadRequestException();
        } else {

            return this.genericRepository.save(entity);
        }
    }

    async findAll(): Promise<T[]> {
        return this.genericRepository.find({ relations: this.relations });
    }

    async findById(id: string): Promise<T> {
        const response = await this.genericRepository.findOne({ relations: this.relations, where: { id: id } });
        if (response) {
            return response;
        }
        throw new NotFoundException();
    }

    async update(id: string, entity: any): Promise<any> {
        const response = await this.genericRepository.findOne({ where: { id: id } });
        if (!response) {
            throw new NotFoundException();
        }
        const entityInstance = this.genericRepository.create(entity);
        const errors = await validate(entityInstance);
        if (errors.length > 0 || entity.id !== id) {
            throw new BadRequestException();
        } else {
            return this.genericRepository.save(entity);
        }
    }

    async delete(id: string): Promise<void> {
        this.genericRepository.delete(id);
    }
}
