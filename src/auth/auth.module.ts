import { AuthServiceProvider } from './auth-service.provider';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';

@Module({
    imports: [UserModule],
    providers: [AuthServiceProvider],
})
export class AuthModule {}
