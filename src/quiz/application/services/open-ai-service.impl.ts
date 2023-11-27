import { OpenAIObjectFactory } from '../model/open-ai-object-factory';
import { OpenAIService } from './open-ai-service';
import { PromptService } from './prompt-service';
import { QuizParser } from '../model/quiz-parser';
import { QuizQuestion } from '../../domain/quiz-question';
import { QuizTheme } from '../../domain/quiz-parameters';

export class OpenAIServiceImpl implements OpenAIService {
    constructor(
        private openAIObjectFactory: OpenAIObjectFactory,
        private promptService: PromptService,
        private quizParser: QuizParser,
    ) {}

    async generateQuestionsForQuiz(
        savedQuizQuestions: QuizQuestion[],
        numberOfQuestions: number,
    ): Promise<QuizQuestion[]> {
        const prompt = this.promptService.getQuizQuestionsPrompt(
            savedQuizQuestions,
            numberOfQuestions,
        );

        const openAIObject = this.openAIObjectFactory.createOpenAIObject();

        const response = await openAIObject.chat.completions.create({
            model: 'gpt-3.5-turbo',
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });

        const [choice] = response.choices;
        return this.quizParser.parseQuizQuestions(choice.message.content || '');
    }

    async generateThemesForQuiz(
        savedQuizThemes: QuizTheme[],
    ): Promise<QuizTheme[]> {
        const prompt = this.promptService.getQuizThemesPrompt(savedQuizThemes);

        const openAIObject = this.openAIObjectFactory.createOpenAIObject();

        const response = await openAIObject.chat.completions.create({
            model: 'gpt-3.5-turbo',
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
