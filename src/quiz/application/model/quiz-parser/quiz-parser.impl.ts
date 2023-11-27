import { QuizParser } from './quiz-parser';
import { QuizAnswer, QuizQuestion } from '../../../domain/quiz-question';
import { QuizTheme } from '../../../domain/quiz-parameters';

export class QuizParserImpl implements QuizParser {
    parseQuizQuestions(stringifiedArray: string): QuizQuestion[] {
        const parsedArray = JSON.parse(stringifiedArray);
        if (!Array.isArray(parsedArray)) {
            throw new Error('Given data is not an array.');
        }

        const containsInvalidQuizQuestion = parsedArray.some((element) => {
            const areSomePropsNotDefined = !element.label || !element.answers;
            const areAnswersNotAnArray = !Array.isArray(element.answers);
            const isLabelNotAString = typeof element.label !== 'string';
            const answersContainInvalidAnswer = element.answers.some(
                (answer: any) => !answer.label || !('isCorrect' in answer),
            );

            return (
                areSomePropsNotDefined ||
                areAnswersNotAnArray ||
                isLabelNotAString ||
                answersContainInvalidAnswer
            );
        });
        if (containsInvalidQuizQuestion) {
            throw new Error(
                'At least one element from given data is not a quiz theme.',
            );
        }

        return parsedArray.map(
            (quizQuestion) =>
                new QuizQuestion(
                    quizQuestion.label,
                    quizQuestion.answers.map(
                        (answer: any) =>
                            new QuizAnswer(answer.label, answer.isCorrect),
                    ),
                ),
        );
    }

    parseQuizThemes(stringifiedArray: string): QuizTheme[] {
        const parsedArray = JSON.parse(stringifiedArray);
        if (!Array.isArray(parsedArray)) {
            throw new Error('Given data is not an array.');
        }

        const containsInvalidQuizTheme = parsedArray.some(
            (element) =>
                !element.code ||
                !element.label ||
                typeof element.code !== 'string' ||
                typeof element.label !== 'string',
        );
        if (containsInvalidQuizTheme) {
            throw new Error(
                'At least one element from given data is not a quiz theme.',
            );
        }

        return parsedArray.map(
            (quizTheme) => new QuizTheme(quizTheme.code, quizTheme.label),
        );
    }
}
