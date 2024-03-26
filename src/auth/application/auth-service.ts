import { SignedInUser } from '../domain/signed-in-user';
import { User } from 'src/user/domain/user';

export abstract class AuthService {
    abstract signIn(user: User): SignedInUser;
}
