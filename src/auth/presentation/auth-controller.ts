import { AccessToken, AuthService } from '../application/auth-service';
import { AUTH_SERVICE_TOKEN } from '../application/auth-service.provider';
import { Controller, Inject, Post, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { User } from '../../user/domain/user';

@Controller()
export class AuthController {
    constructor(
        @Inject(AUTH_SERVICE_TOKEN)
        private authService: AuthService,
    ) {}

    @Post()
    async signIn(
        @Request() req: ExpressRequest & { user: User },
    ): Promise<AccessToken> {
        return this.authService.signIn(req.user);
    }
}
