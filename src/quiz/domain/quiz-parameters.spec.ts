import { QuizParameters, QuizTheme } from './quiz-parameters';

describe('QuizParameters', () => {
    describe('shuffleThemes', () => {
        it('should break current themes order', () => {
            const initialQuizThemes: QuizTheme[] = [
                new QuizTheme('A', 'A'),
                new QuizTheme('B', 'B'),
                new QuizTheme('C', 'C'),
                new QuizTheme('D', 'D'),
                new QuizTheme('E', 'E'),
            ];

            const sut = new QuizParameters(Array.from(initialQuizThemes), []);

            sut.shuffleThemes();

            expect(sut.themes).not.toEqual(initialQuizThemes);
        });
    });
});
