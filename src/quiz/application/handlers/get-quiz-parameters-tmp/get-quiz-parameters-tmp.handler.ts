import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { QuizParameters, QuizTheme } from '../../../domain/quiz-parameters';
import { QuizThemeRepository } from '../../../persistence/quiz-theme/repository/quiz-theme-repository';
import { QUIZ_THEME_REPO_TOKEN } from '../../../persistence/quiz-theme/repository/quiz-theme-repository.provider';

const DEFAULT_NUMBER_OF_QUESTIONS = [5, 10, 15];

export class GetQuizParametersTempCommand implements ICommand {
    constructor() {}
}

@CommandHandler(GetQuizParametersTempCommand)
export class GetQuizParametersTempHandler implements ICommandHandler {
    private existingThemes: QuizTheme[] = [];

    constructor(
        @Inject(QUIZ_THEME_REPO_TOKEN)
        private repository: QuizThemeRepository,
    ) {}

    async execute(): Promise<QuizParameters> {
        await this.getThemes();
        return this.prepareQuizParameters(this.existingThemes);
    }

    private async getThemes(): Promise<void> {
        const themesHaveNotBeenFetched = this.existingThemes.length === 0;

        if (themesHaveNotBeenFetched) {
            this.existingThemes = await this.repository.getQuizThemes();
        }
    }

    private prepareQuizParameters(themes: QuizTheme[]): QuizParameters {
        return new QuizParameters(themes, DEFAULT_NUMBER_OF_QUESTIONS);
    }
}
