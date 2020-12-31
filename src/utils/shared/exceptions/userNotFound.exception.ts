import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFound extends HttpException {
    constructor(id: string) {
        super(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
}
