import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { QuizParameters, QuizTheme } from '../../../domain/quiz-parameters';
import { QuizThemeRepository } from '../../../persistence/quiz-theme/repository/quiz-theme-repository';

const DEFAULT_NUMBER_OF_QUESTIONS = [5, 10, 15];

export class GetQuizParametersTempCommand implements ICommand {
    constructor() {}
}

@CommandHandler(GetQuizParametersTempCommand)
export class GetQuizParametersTempHandler implements ICommandHandler {
    private existingThemes: QuizTheme[] = [];

    constructor(private repository: QuizThemeRepository) {}

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
