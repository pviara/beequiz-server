import { ApiService } from '../../../open-ai/application/services/api/api-service';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { OpenAIService } from '../../../open-ai/application/services/open-ai/open-ai-service';
import { QuizParameters, QuizTheme } from '../../domain/quiz-parameters';
import { QuizThemeRepository } from '../../persistence/quiz-theme/repository/quiz-theme-repository';

export const DEFAULT_NUMBER_OF_QUESTIONS = [5, 10, 15];

export class GetQuizParametersCommand implements ICommand {
    constructor() {}
}

@CommandHandler(GetQuizParametersCommand)
export class GetQuizParametersHandler implements ICommandHandler {
    constructor(
        private apiService: ApiService,
        private openAIService: OpenAIService,
        private repository: QuizThemeRepository,
    ) {}

    async execute(): Promise<QuizParameters> {
        const existingThemes = await this.repository.getQuizThemes();

        if (this.apiService.cannotGenerateQuizThemes()) {
            return this.createQuizParameters(existingThemes);
        }

        const generatedThemes =
            await this.openAIService.generateThemesForQuiz(existingThemes);

        const savedThemes =
            await this.repository.saveGeneratedThemes(generatedThemes);

        this.apiService.flagQuizThemeRequest();

        return this.createQuizParameters([...existingThemes, ...savedThemes]);
    }

    private createQuizParameters(quizThemes: QuizTheme[]): QuizParameters {
        return new QuizParameters(quizThemes, DEFAULT_NUMBER_OF_QUESTIONS);
    }
}
