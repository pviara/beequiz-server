import { AuthenticatedUser } from '../presentation/model/authenticated-user';

export type SignedInUser = {
    token: string;
    user: AuthenticatedUser;
};
