import { ApiService } from './api-service';
import { ApiServiceImpl } from './api-service.impl';
import { DateTimeService } from '../../../../shared/date-time-service/datetime-service';
import { Provider } from '@nestjs/common';

export const ApiServiceProvider: Provider = {
    inject: [DateTimeService],
    provide: ApiService,
    useFactory: (dateTimeService: DateTimeService) => {
        return new ApiServiceImpl(dateTimeService);
    },
};
