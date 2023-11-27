import { Provider } from '@nestjs/common';
import { DateTimeServiceImpl } from './date-time-service.impl';

export const DATE_TIME_SERVICE_TOKEN = 'DateTimeService';

export const DateTimeServiceProvider: Provider = {
    provide: DATE_TIME_SERVICE_TOKEN,
    useClass: DateTimeServiceImpl,
};
