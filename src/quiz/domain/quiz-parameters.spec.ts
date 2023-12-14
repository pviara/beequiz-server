import { QuizParameters, QuizTheme } from './quiz-parameters';

describe('QuizParameters', () => {
    describe('shuffleThemes', () => {
        // todo this test has failed once since and so it can fail, so beware (and change it)
        it('should break current themes order', () => {
            const initialQuizThemes: QuizTheme[] = [
                new QuizTheme('id', 'A', 'A'),
                new QuizTheme('id', 'B', 'B'),
                new QuizTheme('id', 'C', 'C'),
                new QuizTheme('id', 'D', 'D'),
                new QuizTheme('id', 'E', 'E'),
            ];

            const sut = new QuizParameters(Array.from(initialQuizThemes), []);

            sut.shuffleThemes();

            expect(sut.themes).not.toEqual(initialQuizThemes);
        });
    });
});
