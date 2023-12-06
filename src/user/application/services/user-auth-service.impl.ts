import { compare } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../domain/user';
import { UserAuthService } from './user-auth-service';
import { USER_MODEL, UserEntity } from '../../persistence/entity/user-entity';

export class UserAuthServiceImpl implements UserAuthService {
    constructor(
        @InjectModel(USER_MODEL)
        private model: Model<UserEntity>,
    ) {}

    async authenticate(
        username: string,
        password: string,
    ): Promise<User | null> {
        const entity = await this.model.findOne<UserEntity>({ username });

        if (entity) {
            const isValidPassword = await compare(
                password,
                entity.password.hash,
            );
            if (isValidPassword) {
                return new User(
                    entity.id,
                    entity.username,
                    entity.hasBeenWelcomed,
                );
            }
        }

        return null;
    }
}
