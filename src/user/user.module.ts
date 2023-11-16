import { AddUserHandler } from './application/handlers/add-user.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { GetByUsernameHandler } from './application/handlers/get-by-username.handler';
import { Module } from '@nestjs/common';

const commandHandlers = [AddUserHandler];
const queryHandlers = [GetByUsernameHandler];

@Module({
    imports: [CqrsModule],
    providers: [...commandHandlers, ...queryHandlers],
})
export class UserModule {}
