import { DateTimeServiceProvider } from './data-time-service/date-time-service.provider';
import { Module } from '@nestjs/common';

@Module({
    exports: [DateTimeServiceProvider],
    providers: [DateTimeServiceProvider],
})
export class SharedModule {}
