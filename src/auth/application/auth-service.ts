import { SignedInUser } from '../domain/signed-in-user';
import { User } from 'src/user/domain/user';

export interface AuthService {
    authenticate(username: string, password: string): Promise<User | null>;
    signIn(user: User): SignedInUser;
}
