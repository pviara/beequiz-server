import { AccessToken, AuthService } from './auth-service';
import { Controller, Post, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { User } from '../user/domain/user';

@Controller()
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post()
    async signIn(
        @Request() req: ExpressRequest & { user: User },
    ): Promise<AccessToken> {
        return this.authService.signIn(req.user);
    }
}
