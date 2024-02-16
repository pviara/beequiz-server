import { AuthModule } from '../auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './presentation/user-controller';
import { UserPersistenceModule } from './persistence/user.persistence-module';
import { WelcomeUserHandler } from './application/handlers/welcome-user.handler';

const commandHandlers = [WelcomeUserHandler];

@Module({
    controllers: [UserController],
    imports: [forwardRef(() => AuthModule), CqrsModule, UserPersistenceModule],
    providers: [...commandHandlers],
})
export class UserModule {}
