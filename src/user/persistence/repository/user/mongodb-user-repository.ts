import { AddUserRepoDTO } from '../../dto/add-user-repo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../domain/user';
import { UserRepository } from './user-repository';
import { USER_MODEL, UserEntity } from '../../entity/user-entity';

export class MongoDbUserRepository implements UserRepository {
    constructor(
        @InjectModel(USER_MODEL)
        private model: Model<UserEntity>,
    ) {}

    async add(userToAdd: AddUserRepoDTO): Promise<void> {
        await this.model.create({
            email: userToAdd.email,
        });
    }

    async getByEmail(email: string): Promise<User | null> {
        const entity = await this.model.findOne({ email });
        if (entity) {
            return this.mapToUser(entity);
        }

        return null;
    }

    async getById(userId: string): Promise<User | null> {
        const entity = await this.model.findById(userId);
        if (entity) {
            return this.mapToUser(entity);
        }

        return null;
    }

    async update(user: User): Promise<void> {
        await this.model.findByIdAndUpdate(user.id, {
            hasBeenWelcomed: user.hasBeenWelcomed,
        });
    }

    private mapToUser(entity: UserEntity): User {
        return new User(entity.id, entity.email, entity.hasBeenWelcomed);
    }
}
