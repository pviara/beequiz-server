import { PromptServiceImpl } from './prompt-service.impl';
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

    describe('getQuizThemesPrompt', () => {
        it('should retrieve prompt model from res folder', () => {
            stubReadFileSync();

            sut.getQuizThemesPrompt([]);

            expect(fsMock.readFileSync).toHaveBeenCalledTimes(1);
        });

        it('should add quiz themes inside the prompt to mark them as used', () => {
            const savedQuizThemes = [
                new QuizTheme('', 'sport'),
                new QuizTheme('', 'cinéma'),
                new QuizTheme('', 'musique'),
            ];

            stubReadFileSync();

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

function stubReadFileSync(): void {
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
