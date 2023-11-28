import { DateTimeService } from '../../../../shared/datetime-service';
import { DATE_TIME_SERVICE_TOKEN } from '../../../../shared/date-time-service.provider';
import { Inject } from '@nestjs/common';
import { OpenAIService } from '../../../../open-ai/application/services/open-ai/open-ai-service';
import { OPENAI_SERVICE_TOKEN } from '../../../../open-ai/application/services/open-ai/open-ai-service.provider';
import { QuizParameters } from '../../../domain/quiz-parameters';
import { QuizQuestion } from '../../../domain/quiz-question';
import { QuizQuestionRepository } from '../../../persistence/quiz-question/repository/quiz-question-repository';
import { QuizService } from './quiz-service';
import { QuizThemeRepository } from '../../../persistence/quiz-theme/repository/quiz-theme-repository';
import { QUIZ_QUESTION_REPO_TOKEN } from '../../../persistence/quiz-question/repository/quiz-question-repository.provider';
import { QUIZ_THEME_REPO_TOKEN } from '../../../persistence/quiz-theme/repository/quiz-theme-repository.provider';

export const DEFAULT_NUMBER_OF_QUESTIONS = [5, 10, 15];

export class QuizServiceImpl implements QuizService {
    private lastQuestionRequestDate: Date | null = null;
    private lastThemeRequestDate: Date | null = null;

    constructor(
        @Inject(DATE_TIME_SERVICE_TOKEN)
        private dateTimeService: DateTimeService,

        @Inject(OPENAI_SERVICE_TOKEN)
        private openAIService: OpenAIService,

        @Inject(QUIZ_QUESTION_REPO_TOKEN)
        private quizQuestionRepository: QuizQuestionRepository,

        @Inject(QUIZ_THEME_REPO_TOKEN)
        private quizThemeRepository: QuizThemeRepository,
    ) {}

    async getQuizParameters(): Promise<QuizParameters> {
        const savedQuizThemes = this.quizThemeRepository.getQuizThemes();

        if (this.hasLastThemeRequestBeenMadeLessThan72HoursAgo()) {
            const quizParameters = new QuizParameters(
                savedQuizThemes,
                DEFAULT_NUMBER_OF_QUESTIONS,
            );
            quizParameters.shuffleThemes();

            return quizParameters;
        }

        const quizThemes =
            await this.openAIService.generateThemesForQuiz(savedQuizThemes);

        this.quizThemeRepository.saveGeneratedThemes(quizThemes);

        this.recordLastThemeRequestDate();

        return new QuizParameters(quizThemes, DEFAULT_NUMBER_OF_QUESTIONS);
    }

    async getQuizQuestions(
        quizThemeId: string,
        numberOfQuestions: number,
    ): Promise<QuizQuestion[]> {
        const savedQuizQuestions =
            this.quizQuestionRepository.getQuizQuestions(quizThemeId);

        const areEnoughSavedQuestions =
            savedQuizQuestions.length >= numberOfQuestions;

        if (
            this.hasLastQuestionRequestBeenMadeLessThan72HoursAgo() &&
            areEnoughSavedQuestions
        ) {
            return savedQuizQuestions;
        }

        const quizQuestions = await this.openAIService.generateQuestionsForQuiz(
            savedQuizQuestions,
            numberOfQuestions,
        );

        this.quizQuestionRepository.saveGeneratedQuestions(quizQuestions);

        this.recordLastQuestionRequestDate();

        return quizQuestions;
    }

    private hasLastQuestionRequestBeenMadeLessThan72HoursAgo(): boolean {
        if (!this.lastQuestionRequestDate) {
            return false;
        }

        return this.isDateIsLessThan72HoursAgo(this.lastQuestionRequestDate);
    }

    private hasLastThemeRequestBeenMadeLessThan72HoursAgo(): boolean {
        if (!this.lastThemeRequestDate) {
            return false;
        }

        return this.isDateIsLessThan72HoursAgo(this.lastThemeRequestDate);
    }

    private isDateIsLessThan72HoursAgo(date: Date): boolean {
        const currentDate = this.dateTimeService.getNow();
        const timeDifference = currentDate.getTime() - date.getTime();
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        return hoursDifference < 72;
    }

    private recordLastQuestionRequestDate(): void {
        this.lastQuestionRequestDate = this.dateTimeService.getNow();
    }

    private recordLastThemeRequestDate(): void {
        this.lastThemeRequestDate = this.dateTimeService.getNow();
    }
}
