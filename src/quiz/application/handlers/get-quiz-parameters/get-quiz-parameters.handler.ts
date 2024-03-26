import { ApiService } from '../../../../open-ai/application/services/api/api-service';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { OpenAIService } from '../../../../open-ai/application/services/open-ai/open-ai-service';
import { ParsedQuizTheme } from '../../quiz-parser/model/parsed-quiz-theme';
import { QuizParameters, QuizTheme } from '../../../domain/quiz-parameters';
import { QuizThemeRepository } from '../../../persistence/quiz-theme/repository/quiz-theme-repository';
import { QUIZ_THEME_REPO_TOKEN } from '../../../persistence/quiz-theme/repository/quiz-theme-repository.provider';

const DEFAULT_NUMBER_OF_QUESTIONS = [5, 10, 15];

export class GetQuizParametersCommand implements ICommand {
    constructor() {}
}

// @CommandHandler(GetQuizParametersCommand)
export class GetQuizParametersHandler implements ICommandHandler {
    private existingThemes: QuizTheme[] = [];
    private generatedThemes: ParsedQuizTheme[] = [];
    private savedThemes: QuizTheme[] = [];

    constructor(
        private apiService: ApiService,
        private openAIService: OpenAIService,

        @Inject(QUIZ_THEME_REPO_TOKEN)
        private repository: QuizThemeRepository,
    ) {}

    async execute(): Promise<QuizParameters> {
        await this.getThemes();

        if (this.apiService.cannotGenerateQuizThemes()) {
            return this.prepareQuizParameters(this.existingThemes);
        }

        await this.generateThemes();
        await this.saveGeneratedThemes();

        return this.prepareQuizParameters([
            ...this.existingThemes,
            ...this.savedThemes,
        ]);
    }

    private async getThemes(): Promise<void> {
        this.existingThemes = await this.repository.getQuizThemes();
    }

    private prepareQuizParameters(themes: QuizTheme[]): QuizParameters {
        return new QuizParameters(themes, DEFAULT_NUMBER_OF_QUESTIONS);
    }

    private async generateThemes(): Promise<void> {
        this.generatedThemes = await this.openAIService.generateThemesForQuiz(
            this.existingThemes,
        );

        this.apiService.flagQuizThemeRequest();
    }

    private async saveGeneratedThemes(): Promise<void> {
        this.savedThemes = await this.repository.saveGeneratedThemes(
            this.generatedThemes,
        );
    }
}
