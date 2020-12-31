import { HttpException, HttpStatus } from '@nestjs/common';

export class ContentNotFound extends HttpException {
    constructor(id: string) {
        super(`Content with id \'${id}\' not found`, HttpStatus.NOT_FOUND);
    }
}
