import { AddUserRepoDTO } from '../dto/add-user-repo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../domain/user';
import { UserRepository } from './user-repository';
import { USER_MODEL, UserEntity } from '../entity/user-entity';

export class MongoDbUserRepository implements UserRepository {
    constructor(
        @InjectModel(USER_MODEL)
        private model: Model<UserEntity>,
    ) {}

    async add(userToAdd: AddUserRepoDTO): Promise<void> {
        await this.model.create({
            username: userToAdd.username,
            password: {
                hash: userToAdd.hashedPassword.hash,
                salt: userToAdd.hashedPassword.salt,
            },
        });
    }

    async getByUsername(username: string): Promise<User | null> {
        const entity = await this.model.findOne({ username });
        if (entity) {
            return new User(entity.id, entity.username, entity.hasBeenWelcomed);
        }

        return null;
    }
}
