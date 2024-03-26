import { ApiService } from '../../../../open-ai/application/services/api/api-service';
import {
    CommandHandler,
    EventBus,
    ICommand,
    ICommandHandler,
} from '@nestjs/cqrs';
import { ExceededAPIQuotaException } from '../../../../open-ai/application/errors/exceeded-api-quota.exception';
import { Inject } from '@nestjs/common';
import { OpenAIService } from '../../../../open-ai/application/services/open-ai/open-ai-service';
import { ParsedQuizQuestion } from '../../quiz-parser/model/parsed-quiz-question';
import { QuizGameRepository } from '../../../persistence/quiz-game/repository/quiz-game-repository';
import { QuizQuestion } from '../../../domain/quiz-question';
import { QuizQuestionRepository } from '../../../persistence/quiz-question/repository/quiz-question-repository';
import { QuizThemeRepository } from '../../../persistence/quiz-theme/repository/quiz-theme-repository';
import { QuizThemeNotFoundException } from '../../errors/quiz-theme-not-found.exception';
import { QuizTheme } from '../../../domain/quiz-parameters';
import { QUIZ_THEME_REPO_TOKEN } from '../../../persistence/quiz-theme/repository/quiz-theme-repository.provider';
import { ProblemOccurredWithOpenAIException } from '../../errors/problem-occurred-with-openai.exception';
import { QuestionsRetrievedEvent } from '../../events/questions-retrieved.event';
import { StillOnGoingQuizGameException } from '../../errors/still-on-going-quiz-game.exception';

export class GetQuizQuestionsCommand implements ICommand {
    constructor(
        readonly userId: string,
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
    private numberOfQuestions!: number;
    private savedQuestions: QuizQuestion[] = [];
    private theme!: QuizTheme;
    private userId!: string;

    constructor(
        private apiService: ApiService,
        private eventBus: EventBus,
        private openAIService: OpenAIService,
        private gameRepo: QuizGameRepository,

        private questionRepo: QuizQuestionRepository,

        @Inject(QUIZ_THEME_REPO_TOKEN)
        private themeRepo: QuizThemeRepository,
    ) {}

    async execute({
        userId,
        numberOfQuestions,
        themeId,
    }: GetQuizQuestionsCommand): Promise<QuizQuestion[]> {
        this.numberOfQuestions = numberOfQuestions;
        this.userId = userId;

        await this.checkNoOnGoingGame();
        await this.getTheme(themeId);
        await this.getExistingQuestions();

        if (this.cannotGenerateQuizQuestions()) {
            return this.prepareExistingQuestions();
        }

        do {
            try {
                await this.generateQuestions();
                await this.saveGeneratedQuestions();
                return this.prepareSavedQuestions();
            } catch (error: unknown) {
                if (this.areEnoughExistingQuestions()) {
                    return this.prepareExistingQuestions();
                }

                if (error instanceof ExceededAPIQuotaException) {
                    throw new ProblemOccurredWithOpenAIException();
                }
            }
        } while (this.hasNoQuestionBeenGeneratedYet());

        return this.existingQuestions;
    }

    private async checkNoOnGoingGame(): Promise<void> {
        const onGoingGame = await this.gameRepo.getOnGoingGame(this.userId);
        if (onGoingGame) {
            throw new StillOnGoingQuizGameException(this.userId);
        }
    }

    private async getTheme(themeId: string): Promise<QuizTheme> {
        const theme = await this.themeRepo.getQuizTheme(themeId);
        if (!theme) {
            throw new QuizThemeNotFoundException(themeId);
        }

        this.theme = theme;
        return theme;
    }

    private async getExistingQuestions(): Promise<void> {
        this.existingQuestions = await this.questionRepo.getQuizQuestions(
            this.numberOfQuestions,
            this.theme.id,
        );
    }

    private cannotGenerateQuizQuestions(): boolean {
        return (
            this.areEnoughExistingQuestions() &&
            this.apiService.cannotGenerateQuizQuestions()
        );
    }

    private prepareExistingQuestions(): QuizQuestion[] {
        this.publishQuestionsRetrievedEvent('existing');
        return this.existingQuestions;
    }

    private publishQuestionsRetrievedEvent(questions: 'existing' | 'saved') {
        const retrievedQuestions =
            questions === 'existing'
                ? this.getExistingQuestionIds()
                : this.getSavedQuestionIds();

        const event = new QuestionsRetrievedEvent(
            this.userId,
            retrievedQuestions,
        );
        this.eventBus.publish(event);
    }

    private getExistingQuestionIds(): string[] {
        return this.existingQuestions.map((question) => question.id);
    }

    private getSavedQuestionIds(): string[] {
        return this.savedQuestions.map((question) => question.id);
    }

    private areEnoughExistingQuestions(): boolean {
        return this.existingQuestions.length >= this.numberOfQuestions;
    }

    private async generateQuestions(): Promise<void> {
        this.generatedQuestions =
            await this.openAIService.generateQuestionsForQuiz(
                this.existingQuestions,
                this.numberOfQuestions,
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

    private prepareSavedQuestions(): QuizQuestion[] {
        this.publishQuestionsRetrievedEvent('saved');
        return this.savedQuestions;
    }

    private hasNoQuestionBeenGeneratedYet(): boolean {
        return this.generatedQuestions.length === 0;
    }
}
