import { AuthService } from '../application/auth-service';
import { AUTH_SERVICE_TOKEN } from '../application/auth-service.provider';
import {
    Controller,
    Get,
    Inject,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { LocalAuthGuard } from './guards/local-auth-guard';
import { Request as ExpressRequest } from 'express';
import { SignedInUser } from '../domain/signed-in-user';
import { User } from '../../user/domain/user';

@Controller()
export class AuthController {
    constructor(
        @Inject(AUTH_SERVICE_TOKEN)
        private authService: AuthService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async checkToken(): Promise<void> {}

    @UseGuards(LocalAuthGuard)
    @Post()
    async signIn(
        @Request() req: ExpressRequest & { user: User },
    ): Promise<SignedInUser> {
        return this.authService.signIn(req.user);
    }
}
