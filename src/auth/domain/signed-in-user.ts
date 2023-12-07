import { User } from '../../user/domain/user';

export type SignedInUser = {
    token: string;
    user: User;
};
