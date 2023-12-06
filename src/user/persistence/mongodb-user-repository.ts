import { AddUserRepoDTO } from './add-user-repo.dto';
import { Model } from 'mongoose';
import { User } from '../domain/user';
import { UserEntity } from './user-entity';
import { UserRepository } from './user-repository';

export class MongoDbUserRepository implements UserRepository {
    constructor(private model: Model<UserEntity>) {}

    add(userToAdd: AddUserRepoDTO): Promise<void> {
        throw new Error('Method not implemented.');
    }

    getByUsername(username: string): Promise<User | null> {
        throw new Error('Method not implemented.');
    }
}
