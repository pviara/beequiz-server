import OpenAI from 'openai';
import { OpenAIObjectFactory } from './open-ai-object-factory';

export class OpenAIObjectFactoryImpl implements OpenAIObjectFactory {
    createOpenAIObject(): OpenAI {
        return new OpenAI();
    }
}
