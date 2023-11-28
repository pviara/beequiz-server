import { QuizQuestionsParser } from './quiz-questions-parser';

describe('QuizQuestionsParser', () => {
    describe('invalid strings/stringified objects', () => {
        it('should throw an error when given string has not been stringified', () => {
            const cases = ['', '{"name": "John", "age": 30,}', 'hello'];

            for (const _case of cases) {
                const sut = new QuizQuestionsParser(_case);
                expect(() => sut.parse()).toThrow();
            }
        });

        it('should throw an error when given stringified object does not contain a "questions" property', () => {
            const initialObject = [
                { label: 'labelA', answers: [] },
                { label: 'labelB', answers: [] },
                { label: 'labelC', answers: [] },
            ];
            const stringifiedObject = JSON.stringify(initialObject);

            const sut = new QuizQuestionsParser(stringifiedObject);

            expect(() => sut.parse()).toThrow();
        });

        it('should throw an error when given "questions" is not an array', () => {
            const initialObject = {
                questions: 'not_an_array',
            };
            const stringifiedObject = JSON.stringify(initialObject);

            const sut = new QuizQuestionsParser(stringifiedObject);

            expect(() => sut.parse()).toThrow();
        });

        it('should throw an error when at least one element of "questions" array is invalid', () => {
            const initialObjects = [
                {
                    questions: [
                        { code: 'codeA', random: 134 },
                        { code: 'codeB', labels: 'labels' },
                    ],
                },
                {
                    questions: [{ code: [], t: 'any ' }, {}, 'string'],
                },
                {
                    questions: [
                        {
                            label: 'labelA',
                            answers: [
                                { label: 'answer1', isCorrect: true },
                                { isCorrect: false },
                            ],
                        },
                    ],
                },
            ];
            const cases = initialObjects.map((initialObject) =>
                JSON.stringify(initialObject),
            );

            for (const _case of cases) {
                const sut = new QuizQuestionsParser(_case);
                expect(() => sut.parse()).toThrow();
            }
        });
    });

    describe('valid stringified objects', () => {
        it('should not throw any error when given stringified objects match quiz question object structure', () => {
            const initialObject = {
                questions: [
                    {
                        label: 'labelA',
                        answers: [
                            { label: 'answer1', isCorrect: false },
                            { label: 'answer2', isCorrect: true },
                        ],
                    },
                    {
                        label: 'labelB',
                        answers: [{ label: 'answer1', isCorrect: false }],
                    },
                ],
            };
            const stringifiedObject = JSON.stringify(initialObject);

            const sut = new QuizQuestionsParser(stringifiedObject);

            expect(() => sut.parse()).not.toThrow();
        });

        it('should return an array of instantiated quiz questions which length matches initial length', () => {
            const initialObject = {
                questions: [
                    { label: 'labelA', answers: [] },
                    {
                        label: 'labelB',
                        answers: [
                            {
                                label: 'answer1',
                                isCorrect: false,
                            },
                        ],
                    },
                ],
            };
            const stringifiedObject = JSON.stringify(initialObject);

            const sut = new QuizQuestionsParser(stringifiedObject);
            const result = sut.parse();

            const hasEveryQuizQuestionBeenParsed = (): boolean => {
                return result.every((parsedQuizQuestion) =>
                    initialObject.questions.some(
                        (initialQuizQuestion) =>
                            parsedQuizQuestion.label ===
                            initialQuizQuestion.label,
                    ),
                );
            };

            expect(result.length).toBe(initialObject.questions.length);
            expect(hasEveryQuizQuestionBeenParsed()).toBe(true);
        });
    });
});
