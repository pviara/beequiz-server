import { beforeEach, describe, expect, it } from 'vitest';
import { NUMBER_OF_THEMES, PromptServiceImpl } from './prompt-service.impl';
import { QuizQuestion } from '../../../../quiz/domain/quiz-question';
import { QuizTheme } from '../../../../quiz/domain/quiz-parameters';

describe('PromptServiceImpl', () => {
    let sut: PromptServiceImpl;

    beforeEach(() => {
        sut = new PromptServiceImpl();
    });

    describe('getQuizQuestionsPrompt', () => {
        it('should add number of questions and theme label inside the prompt', () => {
            const numberOfQuestions = 5;
            const themeLabel = 'history';
            const result = sut.getQuizQuestionsPrompt(
                [],
                numberOfQuestions,
                themeLabel,
            );

            expect(
                result.includes(
                    `embedded JSON de ${numberOfQuestions} questions`,
                ),
            ).toBe(true);

            expect(
                result.includes(`basées sur le thème de "${themeLabel}"`),
            ).toBe(true);
        });

        it('should add quiz questions inside the prompt to mark them as used', () => {
            const savedQuizQuestions = [
                new QuizQuestion('', 'label1', []),
                new QuizQuestion('', 'label2', []),
                new QuizQuestion('', 'label3', []),
            ];

            const result = sut.getQuizQuestionsPrompt(
                savedQuizQuestions,
                5,
                'geography',
            );

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
                new QuizTheme('', '', 'sport'),
                new QuizTheme('', '', 'cinéma'),
                new QuizTheme('', '', 'musique'),
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
