import { QuizAnswer, QuizQuestion } from '../../domain/quiz-question';
import { QuizParserImpl } from './quiz-parser.impl';
import { QuizTheme } from '../../domain/quiz-parameters';

describe('QuizParserImpl', () => {
    let sut: QuizParserImpl;

    beforeEach(() => {
        sut = new QuizParserImpl();
    });

    describe('parseQuizQuestions', () => {
        it('should throw an error when stringified data is not an array', () => {
            const cases = ['#', -13, { code: 'code', label: 'label ' }];

            for (const _case of cases) {
                const stringifiedObject = JSON.stringify(_case);
                expect(() =>
                    sut.parseQuizQuestions(stringifiedObject),
                ).toThrow();
            }
        });

        it('should throw an error if at least one of array elements is not a valid quiz theme', () => {
            const stringifiedObject = JSON.stringify([
                { label: 'labelA', answers: [] },
                {
                    label: 'labelB',
                    answers: [
                        {
                            label: 'answerB',
                            isCorrect: false,
                        },
                    ],
                },
                {
                    label: 'labelC',
                    answers: [
                        {
                            label: 'answerC',
                        },
                    ],
                },
                { label: 'labelD', answers: [] },
            ]);

            expect(() => sut.parseQuizQuestions(stringifiedObject)).toThrow();
        });

        it('should return array of instances of quiz questions', () => {
            const quizQuestions: QuizQuestion[] = [
                {
                    label: 'labelA',
                    answers: [
                        {
                            label: 'labelA-A',
                            isCorrect: false,
                        },
                        {
                            label: 'labelA-B',
                            isCorrect: true,
                        },
                    ],
                },
                {
                    label: 'labelB',
                    answers: [
                        {
                            label: 'labelB-A',
                            isCorrect: false,
                        },
                        {
                            label: 'labelB-B',
                            isCorrect: true,
                        },
                    ],
                },
            ];
            const stringifiedObject = JSON.stringify(quizQuestions);

            const result = sut.parseQuizQuestions(stringifiedObject);

            expect(result).toEqual([
                new QuizQuestion('labelA', [
                    new QuizAnswer('labelA-A', false),
                    new QuizAnswer('labelA-B', true),
                ]),
                new QuizQuestion('labelB', [
                    new QuizAnswer('labelB-A', false),
                    new QuizAnswer('labelB-B', true),
                ]),
            ]);
        });
    });

    describe('parseQuizThemes', () => {
        it('should throw an error when stringified data is not an array', () => {
            const cases = ['#', -13, { code: 'code', label: 'label ' }];

            for (const _case of cases) {
                const stringifiedObject = JSON.stringify(_case);
                expect(() => sut.parseQuizThemes(stringifiedObject)).toThrow();
            }
        });

        it('should throw an error if at least one of array elements is not a valid quiz theme', () => {
            const stringifiedObject = JSON.stringify([
                { code: 'testA', label: 'labelA' },
                { code: 'testB', label: 'labelB' },
                { code: 'test', label: 15 },
                { code: 'testD', label: 'labelD' },
            ]);

            expect(() => sut.parseQuizThemes(stringifiedObject)).toThrow();
        });

        it('should return array of instances of quiz themes', () => {
            const quizThemes: QuizTheme[] = [
                {
                    code: 'codeA',
                    label: 'labelA',
                },
                {
                    code: 'codeB',
                    label: 'labelB',
                },
                {
                    code: 'codeC',
                    label: 'labelC',
                },
            ];
            const stringifiedObject = JSON.stringify(quizThemes);

            const result = sut.parseQuizThemes(stringifiedObject);

            expect(result).toEqual([
                new QuizTheme('codeA', 'labelA'),
                new QuizTheme('codeB', 'labelB'),
                new QuizTheme('codeC', 'labelC'),
            ]);
        });
    });
});
