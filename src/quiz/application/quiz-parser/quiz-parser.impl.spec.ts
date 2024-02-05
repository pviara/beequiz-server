import { beforeEach, describe, expect, it } from 'vitest';
import { ParsedQuizTheme } from './model/parsed-quiz-theme';
import {
    ParsedQuizAnswer,
    ParsedQuizQuestion,
} from './model/parsed-quiz-question';
import { QuizParserImpl } from './quiz-parser.impl';

describe('QuizParserImpl', () => {
    let sut: QuizParserImpl;

    beforeEach(() => {
        sut = new QuizParserImpl();
    });

    describe('parseQuizQuestions', () => {
        it('should throw an error when stringified data is not an object containing an array', () => {
            const cases = [
                { questions: '#' },
                { questions: -13 },
                { code: 'code', label: 'label ' },
            ];

            for (const _case of cases) {
                const stringifiedObject = JSON.stringify(_case);
                expect(() =>
                    sut.parseQuizQuestions(stringifiedObject),
                ).toThrow();
            }
        });

        it('should throw an error if at least one of array elements is not a valid quiz theme', () => {
            const stringifiedObject = JSON.stringify({
                questions: [
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
                ],
            });

            expect(() => sut.parseQuizQuestions(stringifiedObject)).toThrow();
        });

        it('should return array of instances of quiz questions', () => {
            const quizQuestions: { questions: ParsedQuizQuestion[] } = {
                questions: [
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
                ],
            };
            const stringifiedObject = JSON.stringify(quizQuestions);

            const result = sut.parseQuizQuestions(stringifiedObject);

            expect(result).toEqual([
                new ParsedQuizQuestion('labelA', [
                    new ParsedQuizAnswer('labelA-A', false),
                    new ParsedQuizAnswer('labelA-B', true),
                ]),
                new ParsedQuizQuestion('labelB', [
                    new ParsedQuizAnswer('labelB-A', false),
                    new ParsedQuizAnswer('labelB-B', true),
                ]),
            ]);
        });
    });

    describe('parseQuizThemes', () => {
        it('should throw an error when stringified data is not an object containing an array', () => {
            const cases = [
                { themes: '#' },
                { themes: -13 },
                { code: 'code', label: 'label ' },
            ];

            for (const _case of cases) {
                const stringifiedObject = JSON.stringify(_case);
                expect(() => sut.parseQuizThemes(stringifiedObject)).toThrow();
            }
        });

        it('should throw an error if at least one of array elements is not a valid quiz theme', () => {
            const stringifiedObject = JSON.stringify({
                themes: [
                    { code: 'testA', label: 'labelA' },
                    { code: 'testB', label: 'labelB' },
                    { code: 'test', label: 15 },
                    { code: 'testD', label: 'labelD' },
                ],
            });

            expect(() => sut.parseQuizThemes(stringifiedObject)).toThrow();
        });

        it('should return array of instances of quiz themes', () => {
            const quizThemes: { themes: ParsedQuizTheme[] } = {
                themes: [
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
                ],
            };
            const stringifiedObject = JSON.stringify(quizThemes);

            const result = sut.parseQuizThemes(stringifiedObject);

            expect(result).toEqual([
                new ParsedQuizTheme('codeA', 'labelA'),
                new ParsedQuizTheme('codeB', 'labelB'),
                new ParsedQuizTheme('codeC', 'labelC'),
            ]);
        });
    });
});
