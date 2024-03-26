import { AppConfigModule } from '../../app-config/app-config.module';
import { AppConfigService } from '../../app-config/app-config-service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TEST_DATABASE_URI } from '../../app-config/configuration/database-configuration';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [AppConfigModule],
            inject: [AppConfigService],
            useFactory: (appConfigService: AppConfigService) => {
                return {
                    uri: appConfigService.getDatabaseConfig()[
                        TEST_DATABASE_URI
                    ],
                };
            },
        }),
    ],
})
export class DatabaseTestingModule {}
