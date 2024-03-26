import { User } from '../../../user/domain/user';

export type AuthenticatedUser = Pick<User, 'id' | 'email' | 'hasBeenWelcomed'>;
