import { AuthModule } from '../auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './presentation/user-controller';
import { UserRepoProvider } from './persistence/repository/user-repository.provider';
import { USER_MODEL, userSchema } from './persistence/entity/user-entity';
import { WelcomeUserHandler } from './application/handlers/welcome-user.handler';

const commandHandlers = [WelcomeUserHandler];

@Module({
    controllers: [UserController],
    exports: [UserRepoProvider],
    imports: [
        forwardRef(() => AuthModule),
        CqrsModule,
        MongooseModule.forFeature([{ name: USER_MODEL, schema: userSchema }]),
    ],
    providers: [...commandHandlers, UserRepoProvider],
})
export class UserModule {}
