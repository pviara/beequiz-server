import { AppConfigModule } from '../app-config/app-config.module';
import { AppConfigService } from '../app-config/app-config-service';
import {
    DATABASE_URI,
    DEV_DATABASE_URI,
} from '../app-config/configuration/database-configuration';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [AppConfigModule],
            inject: [AppConfigService],
            useFactory: (appConfigService: AppConfigService) => {
                if (appConfigService.isAppInDevMode()) {
                    return {
                        uri: appConfigService.getDatabaseConfig()[
                            DEV_DATABASE_URI
                        ],
                    };
                }

                return {
                    uri: appConfigService.getDatabaseConfig()[DATABASE_URI],
                };
            },
        }),
    ],
})
export class DatabaseModule {}
