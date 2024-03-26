import { ALLOWED_ORIGIN } from '../../infrastructure/app-config/configuration/application-configuration';
import { AppConfigService } from '../../infrastructure/app-config/app-config-service';
import { AuthService } from '../application/auth-service';
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
        private authService: AuthService,
        private configService: AppConfigService,
    ) {}

    @UseGuards(GoogleAuthGuard)
    @Get('google-redirect')
    async catchGoogleRedirect(
        @Request() req: SignedInRequest,
        @Response() res: ExpressResponse,
    ): Promise<void> {
        const { token } = this.authService.signIn(req.user);
        this.redirectToClientApp(res, token);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUserFromToken(@Request() req: SignedInRequest): Promise<User> {
        return req.user;
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google')
    async signInWithGoogle(): Promise<void> {}

    private redirectToClientApp(res: ExpressResponse, token: string): void {
        const redirectionUrl =
            this.configService.getAppConfig()[ALLOWED_ORIGIN];

        res.redirect(`${redirectionUrl}?token=${token}`);
    }
}
