import { DateTimeService } from '../../../shared/data-time-service/datetime-service';
import { DATE_TIME_SERVICE_TOKEN } from '../../../shared/data-time-service/date-time-service.provider';
import { Inject } from '@nestjs/common';
import { OpenAIService } from '../../../open-ai/application/services/open-ai/open-ai-service';
import { OPENAI_SERVICE_TOKEN } from '../../../open-ai/application/services/open-ai/open-ai-service.provider';
import { QuizParameters } from '../../domain/quiz-parameters';
import { QuizQuestion } from '../../domain/quiz-question';
import { QuizQuestionRepository } from '../../persistence/quiz-question/repository/quiz-question-repository';
import { QuizService } from './quiz-service';
import { QuizThemeRepository } from '../../persistence/quiz-theme/repository/quiz-theme-repository';
import { QUIZ_QUESTION_REPO_TOKEN } from '../../persistence/quiz-question/repository/quiz-question-repository.provider';
import { QUIZ_THEME_REPO_TOKEN } from '../../persistence/quiz-theme/repository/quiz-theme-repository.provider';
import { QuizThemeNotFoundException } from '../errors/quiz-theme-not-found.exception';
import { readFileSync, writeFileSync } from 'fs';

export const DEFAULT_NUMBER_OF_QUESTIONS = [5, 10, 15];

const lastQuestionRequestDateFilePath =
    'src/quiz/application/quiz-service/last-question-request-date.json';
const lastThemeRequestDateFilePath =
    'src/quiz/application/quiz-service/last-theme-request-date.json';

export class QuizServiceImpl implements QuizService {
    private lastQuestionRequestDate: Date | null =
        this.getLastQuestionRequestDateFromJSON();
    private lastThemeRequestDate: Date | null =
        this.getLastThemeRequestDateFromJSON();

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
        let savedQuizThemes = await this.quizThemeRepository.getQuizThemes();

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

        savedQuizThemes =
            await this.quizThemeRepository.saveGeneratedThemes(quizThemes);

        this.recordLastThemeRequestDate();

        return new QuizParameters(savedQuizThemes, DEFAULT_NUMBER_OF_QUESTIONS);
    }

    async getQuizQuestions(
        quizThemeId: string,
        numberOfQuestions: number,
    ): Promise<QuizQuestion[]> {
        let savedQuizQuestions =
            await this.quizQuestionRepository.getQuizQuestions(quizThemeId);

        const areEnoughSavedQuestions =
            savedQuizQuestions.length >= numberOfQuestions;

        if (
            this.hasLastQuestionRequestBeenMadeLessThan72HoursAgo() &&
            areEnoughSavedQuestions
        ) {
            return savedQuizQuestions;
        }

        const quizTheme =
            await this.quizThemeRepository.getQuizTheme(quizThemeId);
        if (!quizTheme) {
            throw new QuizThemeNotFoundException(quizThemeId);
        }

        const parsedQuizQuestions =
            await this.openAIService.generateQuestionsForQuiz(
                savedQuizQuestions,
                numberOfQuestions,
                quizTheme.label,
            );

        savedQuizQuestions =
            await this.quizQuestionRepository.saveGeneratedQuestions(
                parsedQuizQuestions,
                quizTheme.id,
            );

        this.recordLastQuestionRequestDate();

        return savedQuizQuestions;
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
        const now = this.dateTimeService.getNow();
        this.lastQuestionRequestDate = now;
        writeFileSync(
            lastQuestionRequestDateFilePath,
            JSON.stringify({ date: now }),
        );
    }

    private recordLastThemeRequestDate(): void {
        const now = this.dateTimeService.getNow();
        this.lastThemeRequestDate = now;
        writeFileSync(
            lastThemeRequestDateFilePath,
            JSON.stringify({ date: now }),
        );
    }

    private getLastQuestionRequestDateFromJSON(): Date | null {
        const lastRequestDate = JSON.parse(
            readFileSync(lastQuestionRequestDateFilePath).toString(),
        );
        if (!lastRequestDate.date) {
            return null;
        }

        return new Date(lastRequestDate.date);
    }

    private getLastThemeRequestDateFromJSON(): Date | null {
        const lastRequestDate = JSON.parse(
            readFileSync(lastThemeRequestDateFilePath).toString(),
        );
        if (!lastRequestDate.date) {
            return null;
        }

        return new Date(lastRequestDate.date);
    }
}
