import { AddUserHandler } from './application/handlers/add-user.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { GetByUsernameHandler } from './application/handlers/get-by-username.handler';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAuthServiceProvider } from './application/services/user-auth.provider';
import { UserRepoProvider } from './persistence/user-repository.provider';
import { USER_MODEL, userSchema } from './persistence/user-entity';

const commandHandlers = [AddUserHandler];
const queryHandlers = [GetByUsernameHandler];

@Module({
    exports: [UserAuthServiceProvider],
    imports: [
        CqrsModule,
        MongooseModule.forFeature([{ name: USER_MODEL, schema: userSchema }]),
    ],
    providers: [
        ...commandHandlers,
        ...queryHandlers,
        UserAuthServiceProvider,
        UserRepoProvider,
    ],
})
export class UserModule {}
