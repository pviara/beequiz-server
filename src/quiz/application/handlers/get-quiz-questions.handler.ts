import { ApiService } from '../../../open-ai/application/services/api/api-service';
import { API_SERVICE_TOKEN } from '../../../open-ai/application/services/api/api-service.provider';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { OpenAIService } from '../../../open-ai/application/services/open-ai/open-ai-service';
import { OPENAI_SERVICE_TOKEN } from '../../../open-ai/application/services/open-ai/open-ai-service.provider';
import { ParsedQuizQuestion } from '../quiz-parser/model/parsed-quiz-question';
import { QuizQuestionRepository } from '../../persistence/quiz-question/repository/quiz-question-repository';
import { QuizThemeRepository } from '../../persistence/quiz-theme/repository/quiz-theme-repository';
import { QuizThemeNotFoundException } from '../errors/quiz-theme-not-found.exception';
import { QuizTheme } from '../../domain/quiz-parameters';
import { QuizQuestion } from '../../domain/quiz-question';
import { QUIZ_QUESTION_REPO_TOKEN } from '../../persistence/quiz-question/repository/quiz-question-repository.provider';
import { QUIZ_THEME_REPO_TOKEN } from '../../persistence/quiz-theme/repository/quiz-theme-repository.provider';

export class GetQuizQuestionsCommand implements ICommand {
    constructor(
        readonly numberOfQuestions: number,
        readonly themeId: string,
    ) {}
}

@CommandHandler(GetQuizQuestionsCommand)
export class GetQuizQuestionsHandler
    implements ICommandHandler<GetQuizQuestionsCommand>
{
    private existingQuestions: QuizQuestion[] = [];
    private generatedQuestions: ParsedQuizQuestion[] = [];
    private savedQuestions: QuizQuestion[] = [];
    private theme!: QuizTheme;

    constructor(
        @Inject(API_SERVICE_TOKEN)
        private apiService: ApiService,

        @Inject(OPENAI_SERVICE_TOKEN)
        private openAIService: OpenAIService,

        @Inject(QUIZ_QUESTION_REPO_TOKEN)
        private questionRepo: QuizQuestionRepository,

        @Inject(QUIZ_THEME_REPO_TOKEN)
        private themeRepo: QuizThemeRepository,
    ) {}

    async execute({
        numberOfQuestions,
        themeId,
    }: GetQuizQuestionsCommand): Promise<any> {
        const theme = await this.getTheme(themeId);

        await this.getExistingQuestionsFor(theme.id);

        if (
            this.apiService.cannotGenerateQuizQuestions() &&
            this.areEnoughExistingQuestionsFor(numberOfQuestions)
        ) {
            return this.existingQuestions;
        }

        await this.generateQuestions(numberOfQuestions);
        await this.saveGeneratedQuestions();

        return this.savedQuestions;
    }

    private async getTheme(themeId: string): Promise<QuizTheme> {
        const theme = await this.themeRepo.getQuizTheme(themeId);
        if (!theme) {
            throw new QuizThemeNotFoundException(themeId);
        }

        this.theme = theme;
        return theme;
    }

    private async getExistingQuestionsFor(themeId: string): Promise<void> {
        this.existingQuestions =
            await this.questionRepo.getQuizQuestions(themeId);
    }

    private areEnoughExistingQuestionsFor(numberOfQuestions: number): boolean {
        return this.existingQuestions.length >= numberOfQuestions;
    }

    private async generateQuestions(numberOfQuestions: number): Promise<void> {
        this.generatedQuestions =
            await this.openAIService.generateQuestionsForQuiz(
                this.existingQuestions,
                numberOfQuestions,
                this.theme.label,
            );

        this.apiService.flagQuizQuestionRequest();
    }

    private async saveGeneratedQuestions(): Promise<void> {
        this.savedQuestions = await this.questionRepo.saveGeneratedQuestions(
            this.generatedQuestions,
            this.theme.id,
        );
    }
}
