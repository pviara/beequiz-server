import { ApiService } from './api-service';
import { ApiServiceImpl } from './api-service.impl';
import { Provider } from '@nestjs/common';

export const ApiServiceProvider: Provider = {
    provide: ApiService,
    useFactory: () => {},
};
