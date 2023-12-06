import { AddUserHandler } from './application/handlers/add-user.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { GetByUsernameHandler } from './application/handlers/get-by-username.handler';
import { Module } from '@nestjs/common';
import { UserAuthServiceProvider } from './application/services/user-auth.provider';

const commandHandlers = [AddUserHandler];
const queryHandlers = [GetByUsernameHandler];

@Module({
    exports: [UserAuthServiceProvider],
    imports: [CqrsModule],
    providers: [...commandHandlers, ...queryHandlers, UserAuthServiceProvider],
})
export class UserModule {}
