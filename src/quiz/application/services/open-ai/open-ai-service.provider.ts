import { OpenAIServiceImpl } from './open-ai-service.impl';
import { Provider } from '@nestjs/common';

export const OPENAI_SERVICE_TOKEN = 'OpenAIService';

export const OpenAIServiceProvider: Provider = {
    provide: OPENAI_SERVICE_TOKEN,
    useClass: OpenAIServiceImpl,
};
