import { QuizAnswer, QuizQuestion } from '../../../domain/quiz-question';
import { QuizParser } from './quiz-parser';
import { QuizTheme } from '../../../domain/quiz-parameters';
import { QuizThemesParser } from './quiz-themes-parser';

export class QuizParserImpl implements QuizParser {
    parseQuizQuestions(stringifiedArray: string): QuizQuestion[] {
        const parsedObject = JSON.parse(stringifiedArray);
        if (!parsedObject.questions || !Array.isArray(parsedObject.questions)) {
            throw new Error('Given data is not an array.');
        }

        const containsInvalidQuizQuestion = parsedObject.questions.some(
            (element: any) => {
                const areSomePropsNotDefined =
                    !element.label || !element.answers;
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
            },
        );
        if (containsInvalidQuizQuestion) {
            throw new Error(
                'At least one element from given data is not a quiz theme.',
            );
        }

        return parsedObject.questions.map(
            (quizQuestion: any) =>
                new QuizQuestion(
                    quizQuestion.label,
                    quizQuestion.answers.map(
                        (answer: any) =>
                            new QuizAnswer(answer.label, answer.isCorrect),
                    ),
                ),
        );
    }

    parseQuizThemes(stringifiedObject: string): QuizTheme[] {
        return new QuizThemesParser(stringifiedObject).parse();
    }
}
