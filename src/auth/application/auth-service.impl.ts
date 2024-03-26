import { AuthenticatedUser } from '../presentation/model/authenticated-user';
import { AuthService } from './auth-service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignedInUser } from '../domain/signed-in-user';

@Injectable()
export class AuthServiceImpl implements AuthService {
    constructor(private jwtService: JwtService) {}

    signIn(user: AuthenticatedUser): SignedInUser {
        return {
            token: this.jwtService.sign({ email: user.email }),
            user,
        };
    }
}
