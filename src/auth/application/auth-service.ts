import { AuthenticatedUser } from '../presentation/model/authenticated-user';
import { SignedInUser } from '../domain/signed-in-user';

export abstract class AuthService {
    abstract signIn(user: AuthenticatedUser): SignedInUser;
}
