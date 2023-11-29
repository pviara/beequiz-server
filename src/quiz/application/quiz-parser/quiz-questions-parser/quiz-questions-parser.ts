import { isInvalidStructure } from '../../../../utils/utils';
import { QuizAnswer, QuizQuestion } from '../../../domain/quiz-question';

export class QuizQuestionsParser {
    constructor(readonly stringifiedObject: string) {}

    parse(): QuizQuestion[] {
        try {
            const parsedObject = JSON.parse(this.stringifiedObject);
            if (!parsedObject.questions) {
                throw new Error(
                    'Parsed object does not contain a "questions" property.',
                );
            }

            if (!Array.isArray(parsedObject.questions)) {
                throw new Error(
                    'Parsed object "themes" property is not an array.',
                );
            }

            if (this.containsInvalidQuestion(parsedObject)) {
                throw new Error(
                    'Parsed object contains at least one question which structure is invalid.',
                );
            }

            return this.mapQuizQuestions(parsedObject);
        } catch (error: unknown) {
            throw new Error('Parsing given stringified object has failed.');
        }
    }

    private containsInvalidQuestion(parsedObject: any): boolean {
        const { questions }: { questions: Record<string, any>[] } =
            parsedObject;
        return questions.some((question) =>
            this.isInvalidQuizQuestion(question),
        );
    }

    private isInvalidQuizQuestion(checkedObject: Record<string, any>): boolean {
        const objStructRef = this.createObjectStructureRef();
        return isInvalidStructure(checkedObject, objStructRef);
    }

    private createObjectStructureRef(): QuizQuestion {
        return new QuizQuestion('label', [new QuizAnswer('label', true)]);
    }

    private mapQuizQuestions(parsedObject: any): QuizQuestion[] {
        return parsedObject.questions.map(
            (quizQuestion: Record<string, any>) =>
                new QuizQuestion(quizQuestion.label, quizQuestion.answers),
        );
    }
}