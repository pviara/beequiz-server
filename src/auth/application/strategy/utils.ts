import { AuthenticatedUser } from '../../presentation/model/authenticated-user';
import { User } from '../../../user/domain/user';

export function mapToAuthenticatedUser(user: User): AuthenticatedUser {
    return {
        id: user.id,
        email: user.email,
        hasBeenWelcomed: user.hasBeenWelcomed,
    };
}
