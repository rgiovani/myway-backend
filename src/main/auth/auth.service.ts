import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import User from '../../utils/shared/entities/User.entity';
import { StudentService } from '../student/student.service';
import { generatePayload } from './payload';

@Injectable()
export class AuthService {
    constructor(
        private studentService: StudentService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.studentService.getByEmail(email);
        if (user && compareSync(password, user.password)) {
            const { id, firstName, lastName, email, type, profilePhoto } = user;
            return { id, firstName, lastName, email, type, profilePhoto };
        }
        return null;
    }

    async createUser(user: User) {
        return this.studentService.createStudent(user);
    }

    async login(user: any) {
        const payload = generatePayload(user);
        
        return {
            access_token: this.jwtService.sign(payload)
        };
    }
}
