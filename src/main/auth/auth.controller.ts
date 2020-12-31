import { Body, ClassSerializerInterceptor, Controller, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import User from '../../utils/shared/entities/User.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly jwtServ: JwtService
    ) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() request: any) {
        return this.authService.login(request.user);
    }

    @Post('signup')
    @UseInterceptors(ClassSerializerInterceptor)
    async createUser(@Body() user: User) {
        return this.authService.createUser(user);
    }

}
