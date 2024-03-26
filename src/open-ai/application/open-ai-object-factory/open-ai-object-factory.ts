import OpenAI from 'openai';

export abstract class OpenAIObjectFactory {
    abstract createOpenAIObject(): OpenAI;
}
