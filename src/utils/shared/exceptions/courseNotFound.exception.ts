import { HttpException, HttpStatus } from '@nestjs/common';

export class CourseNotFound extends HttpException {
    constructor(id: string) {
        super(`Course with id \'${id}\' not found`, HttpStatus.NOT_FOUND);
    }
}
