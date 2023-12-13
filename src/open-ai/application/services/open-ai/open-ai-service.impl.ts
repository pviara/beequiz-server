import { Inject } from '@nestjs/common';
import { OpenAIObjectFactory } from '../../../../open-ai/application/open-ai-object-factory/open-ai-object-factory';
import { OpenAIService } from './open-ai-service';
import { OPENAI_OBJECT_FACTORY_TOKEN } from '../../../../open-ai/application/open-ai-object-factory/open-ai-object-factory.provider';
import { ParsedQuizQuestion } from '../../../../quiz/application/quiz-parser/model/parsed-quiz-question';
import { ParsedQuizTheme } from '../../../../quiz/application/quiz-parser/model/parsed-quiz-theme';
import { PromptService } from '../prompt/prompt-service';
import { PROMPT_SERVICE_TOKEN } from '../prompt/prompt-service.provider';
import { QuizParser } from '../../../../quiz/application/quiz-parser/quiz-parser';
import { QuizQuestion } from '../../../../quiz/domain/quiz-question';
import { QuizTheme } from '../../../../quiz/domain/quiz-parameters';
import { QUIZ_PARSER_TOKEN } from '../../../../quiz/application/quiz-parser/quiz-parser.provider';

export class OpenAIServiceImpl implements OpenAIService {
    constructor(
        @Inject(OPENAI_OBJECT_FACTORY_TOKEN)
        private openAIObjectFactory: OpenAIObjectFactory,

        @Inject(PROMPT_SERVICE_TOKEN)
        private promptService: PromptService,

        @Inject(QUIZ_PARSER_TOKEN)
        private quizParser: QuizParser,
    ) {}

    async generateQuestionsForQuiz(
        savedQuizQuestions: QuizQuestion[],
        numberOfQuestions: number,
        themeLabel: string,
    ): Promise<ParsedQuizQuestion[]> {
        const prompt = this.promptService.getQuizQuestionsPrompt(
            savedQuizQuestions,
            numberOfQuestions,
            themeLabel,
        );

        const openAIObject = this.openAIObjectFactory.createOpenAIObject();

        try {
            const response = await openAIObject.chat.completions.create({
                model: 'gpt-4-1106-preview',
                response_format: { type: 'json_object' },
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            });

            const [choice] = response.choices;
            return this.quizParser.parseQuizQuestions(
                choice.message.content || '',
            );
        } catch (error: unknown) {
            throw error;
        }
    }

    async generateThemesForQuiz(
        existingThemes: QuizTheme[],
    ): Promise<ParsedQuizTheme[]> {
        const prompt = this.promptService.getQuizThemesPrompt(existingThemes);

        const openAIObject = this.openAIObjectFactory.createOpenAIObject();

        const response = await openAIObject.chat.completions.create({
            model: 'gpt-3.5-turbo-1106',
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });

        const [choice] = response.choices;
        return this.quizParser.parseQuizThemes(choice.message.content || '');
    }
}
