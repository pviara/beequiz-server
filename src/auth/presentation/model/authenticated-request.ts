import { Request } from 'express';
import { User } from '../../../user/domain/user';

export type AuthenticatedRequest = Request & {
    user: User;
};
