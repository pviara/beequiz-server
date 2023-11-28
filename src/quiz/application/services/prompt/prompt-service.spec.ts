import { NUMBER_OF_THEMES, PromptServiceImpl } from './prompt-service.impl';
import { QuizQuestion } from '../../../domain/quiz-question';
import { QuizTheme } from '../../../domain/quiz-parameters';

describe('PromptServiceImpl', () => {
    let sut: PromptServiceImpl;

    beforeEach(() => {
        sut = new PromptServiceImpl();
    });

    describe('getQuizQuestionsPrompt', () => {
        it('should add number of questions inside the prompt', () => {
            const numberOfQuestions = 5;
            const result = sut.getQuizQuestionsPrompt([], numberOfQuestions);

            expect(
                result.includes(
                    `embedded JSON de ${numberOfQuestions} questions`,
                ),
            ).toBe(true);
        });

        it('should add quiz questions inside the prompt to mark them as used', () => {
            const savedQuizQuestions = [
                new QuizQuestion('label1', []),
                new QuizQuestion('label2', []),
                new QuizQuestion('label3', []),
            ];

            const result = sut.getQuizQuestionsPrompt(savedQuizQuestions, 5);

            const [{ label: label1 }, { label: label2 }, { label: label3 }] =
                savedQuizQuestions;

            expect(
                result.includes(
                    `Questions déjà utilisées : ${label1},${label2},${label3}`,
                ),
            ).toBe(true);
        });
    });

    describe('getQuizThemesPrompt', () => {
        it('should add number of themes inside the prompt', () => {
            const result = sut.getQuizThemesPrompt([]);

            expect(result.includes(`liste de ${NUMBER_OF_THEMES} thèmes`)).toBe(
                true,
            );
        });

        it('should add quiz themes inside the prompt to mark them as used', () => {
            const savedQuizThemes = [
                new QuizTheme('', 'sport'),
                new QuizTheme('', 'cinéma'),
                new QuizTheme('', 'musique'),
            ];

            const result = sut.getQuizThemesPrompt(savedQuizThemes);

            const [{ label: label1 }, { label: label2 }, { label: label3 }] =
                savedQuizThemes;

            expect(
                result.includes(
                    `Thèmes déjà utilisés : ${label1},${label2},${label3}`,
                ),
            ).toBe(true);
        });
    });
});
