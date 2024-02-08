import { SignedInUser } from '../domain/signed-in-user';
import { User } from 'src/user/domain/user';

export interface AuthService {
    signIn(user: User): SignedInUser;
}
