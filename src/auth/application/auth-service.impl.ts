import { AuthService } from './auth-service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignedInUser } from '../domain/signed-in-user';
import { User } from '../../user/domain/user';

@Injectable()
export class AuthServiceImpl implements AuthService {
    constructor(private jwtService: JwtService) {}

    signIn(user: User): SignedInUser {
        return {
            token: this.jwtService.sign({ email: user.email }),
            user,
        };
    }
}
