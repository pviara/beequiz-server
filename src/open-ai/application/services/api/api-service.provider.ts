import { ApiServiceImpl } from './api-service.impl';
import { Provider } from '@nestjs/common';

export const API_SERVICE_TOKEN = 'ApiService';

export const ApiServiceProvider: Provider = {
    provide: API_SERVICE_TOKEN,
    useClass: ApiServiceImpl,
};
