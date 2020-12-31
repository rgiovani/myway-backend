import { HttpException, HttpStatus } from '@nestjs/common';

export class TeacherNotFound extends HttpException {
    constructor(id: string) {
        super(`Teacher with id \'${id}\' not found`, HttpStatus.NOT_FOUND);
    }
}
