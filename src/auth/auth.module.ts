import { AuthServiceProvider } from './auth-service.provider';
import { Module } from '@nestjs/common';

@Module({
    providers: [AuthServiceProvider],
})
export class AuthModule {}
