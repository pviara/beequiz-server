import { DateTimeService } from './datetime-service';
import { DateTimeServiceImpl } from './date-time-service.impl';
import { Provider } from '@nestjs/common';

export const DateTimeServiceProvider: Provider = {
    provide: DateTimeService,
    useValue: () => new DateTimeServiceImpl(),
};
