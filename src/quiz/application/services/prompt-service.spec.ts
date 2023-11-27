import { NUMBER_OF_THEMES, PromptServiceImpl } from './prompt-service.impl';
import { QuizQuestion } from '../../domain/quiz-question';
import { QuizTheme } from '../../domain/quiz-parameters';
import * as fs from 'fs';

jest.mock('fs');
const fsMock = fs as jest.Mocked<typeof fs>;

describe('PromptService', () => {
    let sut: PromptServiceImpl;

    beforeEach(() => {
        jest.resetAllMocks();
        sut = new PromptServiceImpl();
    });

    describe('getQuizQuestionsPrompt', () => {
        it('should retrieve prompt model from res folder', () => {
            stubReadFileSyncWithQuestionsPrompt();

            sut.getQuizQuestionsPrompt([], 0);

            expect(fsMock.readFileSync).toHaveBeenCalledTimes(1);
            expect(fsMock.readFileSync).toHaveBeenCalledWith(
                '../prompts/quiz-questions-prompt.model.txt',
            );
        });

        it('should add number of questions inside the prompt', () => {
            stubReadFileSyncWithQuestionsPrompt();

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

            stubReadFileSyncWithQuestionsPrompt();

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
        it('should retrieve prompt model from res folder', () => {
            stubReadFileSyncWithThemesPrompt();

            sut.getQuizThemesPrompt([]);

            expect(fsMock.readFileSync).toHaveBeenCalledTimes(1);
            expect(fsMock.readFileSync).toHaveBeenCalledWith(
                '../prompts/quiz-themes-prompt.model.txt',
            );
        });

        it('should add number of themes inside the prompt', () => {
            stubReadFileSyncWithThemesPrompt();

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

            stubReadFileSyncWithThemesPrompt();

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

function stubReadFileSyncWithQuestionsPrompt(): void {
    const dummyBuffer = Buffer.from(
        `Génère embedded JSON de X questions de quiz basées sur le thème de "Y". Chacune a 4 choix de réponses dont la longueur ne doit pas dépasser 13 caractères. Une seule doit être correcte.

        Le format JSON des questions doit être le suivant :
        
        label: contient la question en elle-même
        answers: est un tableau de réponses qui contient des objets de la forme ci-dessous
        
        label: contient la réponse en elle-même
        isCorrect: indique si la réponse à la question est la bonne
        
        Questions déjà utilisées : #
        
        Toutes unités mesure en fr et abrégées
        Oublie pas les accents, cédilles etc. dans le label
        Pas de texte dans ta réponse`,
    );

    fsMock.readFileSync.mockReturnValueOnce(dummyBuffer);
}

function stubReadFileSyncWithThemesPrompt(): void {
    const dummyBuffer = Buffer.from(
        `Génère liste de X thèmes pour un quiz au format JSON avec les propriétés suivantes :

        "code" : nom du thème minuscules, sans accent, espaces remplacés par des dash
        "label" : nom du thème minuscules
        
        Thèmes déjà utilisés : #
        
        Toutes unités mesure en fr et abrégées
        Oublie pas les accents, cédilles etc. dans le label
        Pas de texte dans ta réponse`,
    );

    fsMock.readFileSync.mockReturnValueOnce(dummyBuffer);
}
