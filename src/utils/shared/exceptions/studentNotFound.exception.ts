import { HttpException, HttpStatus } from '@nestjs/common';

export class StudentNotFound extends HttpException {
    constructor(id: string) {
        super(`Student with id \'${id}\' not found`, HttpStatus.NOT_FOUND);
    }
}
