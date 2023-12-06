import { MongoDbUserRepository } from './mongodb-user-repository';
import { Provider } from '@nestjs/common';

export const USER_REPO_TOKEN = 'UserRepository';

export const UserRepoProvider: Provider = {
    provide: USER_REPO_TOKEN,
    useClass: MongoDbUserRepository,
};
