import { ALLOWED_ORIGIN } from '../../infrastructure/app-config/configuration/application-configuration';
import { AppConfigService } from '../../infrastructure/app-config/app-config-service';
import { AuthenticatedUser } from './model/authenticated-user';
import { AuthService } from '../application/auth-service';
import {
    Controller,
    Get,
    HttpRedirectResponse,
    HttpStatus,
    Redirect,
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

type SignedInRequest = ExpressRequest & {
    user: AuthenticatedUser;
};

@Controller()
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: AppConfigService,
    ) {}

    @UseGuards(GoogleAuthGuard)
    @Redirect()
    @Get('google-redirect')
    async catchGoogleRedirect(
        @Request() req: SignedInRequest,
    ): Promise<HttpRedirectResponse> {
        const { token } = this.authService.signIn(req.user);
        return this.redirectToClientApp(token);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUserFromToken(
        @Request() req: SignedInRequest,
    ): Promise<AuthenticatedUser> {
        return req.user;
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google')
    async signInWithGoogle(): Promise<void> {}

    private redirectToClientApp(token: string): HttpRedirectResponse {
        const redirectionUrl =
            this.configService.getAppConfig()[ALLOWED_ORIGIN];

        return {
            url: `${redirectionUrl}?token=${token}`,
            statusCode: HttpStatus.PERMANENT_REDIRECT,
        };
    }
}
