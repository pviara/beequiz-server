import { isInvalidStructure } from '../../../../utils/utils';
import { QuizTheme } from '../../../domain/quiz-parameters';
import { ParsedQuizTheme } from '../model/parsed-quiz-theme';

export class QuizThemesParser {
    constructor(readonly stringifiedObject: string) {}

    parse(): ParsedQuizTheme[] {
        try {
            const parsedObject = JSON.parse(this.stringifiedObject);
            if (!parsedObject.themes) {
                throw new Error(
                    'Parsed object does not contain a "themes" property.',
                );
            }

            if (!Array.isArray(parsedObject.themes)) {
                throw new Error(
                    'Parsed object "themes" property is not an array.',
                );
            }

            if (this.containsInvalidQuizTheme(parsedObject)) {
                throw new Error(
                    'Parsed object contains at least one theme which structure is invalid.',
                );
            }

            return this.mapQuizThemes(parsedObject);
        } catch (error: unknown) {
            throw new Error('Parsing given stringified object has failed.');
        }
    }

    private containsInvalidQuizTheme(parsedObject: any): boolean {
        const { themes }: { themes: Record<string, any>[] } = parsedObject;
        return themes.some((theme) => this.isInvalidQuizTheme(theme));
    }

    private isInvalidQuizTheme(checkedObject: Record<string, any>): boolean {
        const objStructRef = this.createObjectStructureRef();
        return isInvalidStructure(checkedObject, objStructRef);
    }

    private createObjectStructureRef(): ParsedQuizTheme {
        return new ParsedQuizTheme('code', 'label');
    }

    private mapQuizThemes(parsedObject: any): QuizTheme[] {
        return parsedObject.themes.map(
            (quizTheme: Record<string, any>) =>
                new ParsedQuizTheme(quizTheme.code, quizTheme.label),
        );
    }
}
