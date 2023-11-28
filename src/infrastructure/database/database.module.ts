import { AppConfigModule } from '../app-config/app-config.module';
import { AppConfigService } from '../app-config/app-config-service';
import { APP_CONFIG_SERVICE_TOKEN } from '../app-config/app-config-service.provider';
import { DATABASE_URI } from '../app-config/configuration/database-configuration';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [AppConfigModule],
            inject: [APP_CONFIG_SERVICE_TOKEN],
            useFactory: (appConfigService: AppConfigService) => {
                return {
                    uri: appConfigService.getDatabaseConfig()[DATABASE_URI],
                };
            },
        }),
    ],
})
export class DatabaseModule {}
