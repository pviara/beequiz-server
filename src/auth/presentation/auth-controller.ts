import { AuthService } from '../application/auth-service';
import { AUTH_SERVICE_TOKEN } from '../application/auth-service.provider';
import { Controller, Get, Inject, Request, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { SignedInUser } from '../domain/signed-in-user';
import { User } from '../../user/domain/user';
import { GoogleAuthGuard } from './guards/google-auth-guard';

type SignedInRequest = ExpressRequest & {
    user: User;
};

@Controller()
export class AuthController {
    constructor(
        @Inject(AUTH_SERVICE_TOKEN)
        private authService: AuthService,
    ) {}

    @UseGuards(GoogleAuthGuard)
    @Get('google-redirect')
    async catchGoogleRedirect(
        @Request() req: SignedInRequest,
    ): Promise<SignedInUser> {
        return this.authService.signIn(req.user);
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google')
    async signInWithGoogle(): Promise<void> {}
}
