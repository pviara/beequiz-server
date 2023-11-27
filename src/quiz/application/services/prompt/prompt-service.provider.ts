import { PromptServiceImpl } from './prompt-service.impl';
import { Provider } from '@nestjs/common';

export const PROMPT_SERVICE_TOKEN = 'PromptService';

export const PromptServiceProvider: Provider = {
    provide: PROMPT_SERVICE_TOKEN,
    useClass: PromptServiceImpl,
};
