import { DateTimeService } from '../../../application/datetime-service';
import { OpenAIService } from './open-ai-service';
import { QuizParameters } from '../../domain/quiz-parameters';
import { QuizThemeRepository } from '../../persistence/quiz-theme-repository';
import { QuizService } from './quiz-service';

export const DEFAULT_NUMBER_OF_QUESTIONS = [5, 10, 15];

export class QuizServiceImplement implements QuizService {
    private lastRequestDate: Date | null = null;

    constructor(
        private dateTimeService: DateTimeService,
        private openAIService: OpenAIService,
        private quizThemeRepository: QuizThemeRepository,
    ) {}

    async getQuizParameters(): Promise<QuizParameters> {
        const savedQuizThemes = this.quizThemeRepository.getQuizThemes();

        if (this.hasLastRequestBeenMadeLessThan72HoursAgo()) {
            return new QuizParameters(
                savedQuizThemes,
                DEFAULT_NUMBER_OF_QUESTIONS,
            );
        }

        const quizThemes =
            await this.openAIService.generateThemesForQuiz(savedQuizThemes);
        this.quizThemeRepository.saveGeneratedThemes(quizThemes);

        this.recordLastRequestDate();

        return new QuizParameters(quizThemes, DEFAULT_NUMBER_OF_QUESTIONS);
    }

    private hasLastRequestBeenMadeLessThan72HoursAgo(): boolean {
        if (!this.lastRequestDate) {
            return false;
        }

        const currentDate = this.dateTimeService.getNow();
        const timeDifference =
            currentDate.getTime() - this.lastRequestDate.getTime();
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        return hoursDifference < 72;
    }

    private recordLastRequestDate(): void {
        this.lastRequestDate = this.dateTimeService.getNow();
    }
}
