import { MongoDbUserRepository } from './mongodb-user-repository';
import { Provider } from '@nestjs/common';
import { UserRepository } from './user-repository';

export const UserRepoProvider: Provider = {
    provide: UserRepository,
    useClass: MongoDbUserRepository,
};
