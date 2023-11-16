import { CqrsModule } from '@nestjs/cqrs';
import { GetByUsernameHandler } from './application/get-by-username.handler';
import { Module } from '@nestjs/common';

const queryHandlers = [GetByUsernameHandler];

@Module({
    imports: [CqrsModule],
    providers: [...queryHandlers],
})
export class UserModule {}
