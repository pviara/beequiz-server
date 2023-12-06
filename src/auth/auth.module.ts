import { AuthController } from './presentation/auth-controller';
import { AuthServiceProvider } from './application/auth-service.provider';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';

@Module({
    controllers: [AuthController],
    imports: [UserModule],
    providers: [AuthServiceProvider],
})
export class AuthModule {}
