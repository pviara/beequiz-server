import OpenAI from 'openai';

export interface OpenAIObjectFactory {
    createOpenAIObject(): OpenAI;
}
