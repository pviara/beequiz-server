import { AppConfigServiceProvider } from './app-config-service.provider';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
    imports: [ConfigModule.forRoot()],
    exports: [AppConfigServiceProvider],
    providers: [AppConfigServiceProvider],
})
export class AppConfigModule {}
