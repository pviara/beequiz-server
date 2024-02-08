import { AuthService } from '../application/auth-service';
import { AUTH_SERVICE_TOKEN } from '../application/auth-service.provider';
import {
    Controller,
    Get,
    Inject,
    Request,
    Response,
    UseGuards,
} from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google-auth-guard';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import {
    Request as ExpressRequest,
    Response as ExpressResponse,
} from 'express';
import { User } from '../../user/domain/user';

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
        @Response() res: ExpressResponse,
    ): Promise<void> {
        const { token } = this.authService.signIn(req.user);
        res.redirect(`http://localhost:4200?token=${token}`);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUserFromToken(@Request() req: SignedInRequest): Promise<User> {
        return req.user;
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google')
    async signInWithGoogle(): Promise<void> {}
}
