import { PromptService } from './prompt-service';
import { PromptServiceImpl } from './prompt-service.impl';
import { Provider } from '@nestjs/common';

export const PromptServiceProvider: Provider = {
    provide: PromptService,
    useValue: new PromptServiceImpl(),
};
