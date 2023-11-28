import { QuizThemesParser } from './quiz-themes-parser';

describe('QuizThemesParser', () => {
    describe('invalid strings/stringified objects', () => {
        it('should throw an error when given string has not been stringified', () => {
            const cases = ['', '{"name": "John", "age": 30,}', 'hello'];

            for (const _case of cases) {
                const sut = new QuizThemesParser(_case);
                expect(() => sut.parse()).toThrow();
            }
        });

        it('should throw an error when given stringified object does not contain a "themes" property', () => {
            const initialObject = [
                { code: 'codeA', label: 'labelA' },
                { code: 'codeB', label: 'labelB' },
                { code: 'codeC', label: 'labelC' },
            ];
            const stringifiedObject = JSON.stringify(initialObject);

            const sut = new QuizThemesParser(stringifiedObject);

            expect(() => sut.parse()).toThrow();
        });

        it('should throw an error when given "themes" is not an array', () => {
            const initialObject = {
                themes: 'not_an_array',
            };
            const stringifiedObject = JSON.stringify(initialObject);

            const sut = new QuizThemesParser(stringifiedObject);

            expect(() => sut.parse()).toThrow();
        });

        it('should throw an error when at least one element of "themes" array is invalid', () => {
            const initialObjects = [
                {
                    themes: [
                        { code: 'codeA', random: 134 },
                        { code: 'codeB', labels: 'labels' },
                    ],
                },
                {
                    themes: [{ code: [], t: 'any ' }, {}, 'string'],
                },
            ];
            const cases = initialObjects.map((initialObject) =>
                JSON.stringify(initialObject),
            );

            for (const _case of cases) {
                const sut = new QuizThemesParser(_case);
                expect(() => sut.parse()).toThrow();
            }
        });
    });

    describe('valid stringified objects', () => {
        it('should not throw any error when given stringified objects match quiz theme object structure', () => {
            const initialObject = {
                themes: [
                    { code: 'codeA', label: 'labelA' },
                    { code: 'codeB', label: 'labelB' },
                ],
            };
            const stringifiedObject = JSON.stringify(initialObject);

            const sut = new QuizThemesParser(stringifiedObject);

            expect(() => sut.parse()).not.toThrow();
        });

        it('should return an array of instantiated quiz themes which length matches initial length', () => {
            const initialObject = {
                themes: [
                    { code: 'codeA', label: 'labelA' },
                    { code: 'codeB', label: 'labelB' },
                ],
            };
            const stringifiedObject = JSON.stringify(initialObject);

            const sut = new QuizThemesParser(stringifiedObject);
            const result = sut.parse();

            const hasEveryQuizThemeBeenParsed = (): boolean => {
                return result.every((parsedQuizTheme) =>
                    initialObject.themes.some(
                        (initialQuizTheme) =>
                            parsedQuizTheme.code === initialQuizTheme.code,
                    ),
                );
            };

            expect(result.length).toBe(initialObject.themes.length);
            expect(hasEveryQuizThemeBeenParsed()).toBe(true);
        });
    });
});
