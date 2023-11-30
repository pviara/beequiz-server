import { ApiService } from '../../../open-ai/application/services/api/api-service';
import { API_SERVICE_TOKEN } from '../../../open-ai/application/services/api/api-service.provider';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { OpenAIService } from '../../../open-ai/application/services/open-ai/open-ai-service';
import { OPENAI_SERVICE_TOKEN } from '../../../open-ai/application/services/open-ai/open-ai-service.provider';
import { QuizParameters, QuizTheme } from '../../domain/quiz-parameters';
import { QuizThemeRepository } from '../../persistence/quiz-theme/repository/quiz-theme-repository';
import { QUIZ_THEME_REPO_TOKEN } from '../../persistence/quiz-theme/repository/quiz-theme-repository.provider';

const DEFAULT_NUMBER_OF_QUESTIONS = [5, 10, 15];

export class GetQuizParametersCommand implements ICommand {
    constructor() {}
}

@CommandHandler(GetQuizParametersCommand)
export class GetQuizParametersHandler implements ICommandHandler {
    constructor(
        @Inject(API_SERVICE_TOKEN)
        private apiService: ApiService,

        @Inject(OPENAI_SERVICE_TOKEN)
        private openAIService: OpenAIService,

        @Inject(QUIZ_THEME_REPO_TOKEN)
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
