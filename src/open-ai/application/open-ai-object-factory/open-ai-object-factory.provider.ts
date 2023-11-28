import { OpenAIObjectFactoryImpl } from './open-ai-object-factory.impl';
import { Provider } from '@nestjs/common';

export const OPENAI_OBJECT_FACTORY_TOKEN = 'OpenAIObjectFactory';

export const OpenAIObjectFactoryProvider: Provider = {
    provide: OPENAI_OBJECT_FACTORY_TOKEN,
    useClass: OpenAIObjectFactoryImpl,
};
