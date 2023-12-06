import { User } from 'src/user/domain/user';

export type AccessToken = {
    token: string;
};

export interface AuthService {
    authenticate(username: string, password: string): Promise<User | null>;
    signIn(user: User): AccessToken;
}
