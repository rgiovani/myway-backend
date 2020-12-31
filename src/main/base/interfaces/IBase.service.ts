export interface IBaseCrudService<T> {
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T>;
    update(id: string, entity: T): Promise<any>;
    create(entity: T): Promise<T>;
    delete(id: string);
}