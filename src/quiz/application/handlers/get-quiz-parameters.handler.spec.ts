import {
    ApiServiceSpy,
    stubCannotGenerateQuizThemes,
} from './test/api-service.spy';
import { GetQuizParametersHandler } from './get-quiz-parameters.handler';
import {
    OpenAIServiceSpy,
    stubGenerateThemesForQuiz,
} from './test/open-ai-api-service.spy';
import { ParsedQuizTheme } from '../quiz-parser/model/parsed-quiz-theme';
import { QuizTheme } from '../../domain/quiz-parameters';
import {
    QuizThemeRepositorySpy,
    mapToQuizThemes,
    stubGetQuizThemes,
    stubSaveGeneratedThemes,
} from './test/quiz-theme-repository.spy';

describe('GetQuizParametersHandler', () => {
    let sut: GetQuizParametersHandler;

    let apiServiceSpy: ApiServiceSpy;
    let openAIServiceSpy: OpenAIServiceSpy;
    let quizThemeRepoSpy: QuizThemeRepositorySpy;

    const existingThemes: QuizTheme[] = [
        new QuizTheme('id1', 'code1', 'label1'),
        new QuizTheme('id2', 'code2', 'label2'),
        new QuizTheme('id3', 'code3', 'label3'),
    ];

    const generatedThemes: ParsedQuizTheme[] = [
        new ParsedQuizTheme('codeA', 'labelA'),
        new ParsedQuizTheme('codeB', 'labelB'),
        new ParsedQuizTheme('codeC', 'labelC'),
    ];

    beforeEach(() => {
        apiServiceSpy = new ApiServiceSpy();
        openAIServiceSpy = new OpenAIServiceSpy();
        quizThemeRepoSpy = new QuizThemeRepositorySpy();

        sut = new GetQuizParametersHandler(
            apiServiceSpy,
            openAIServiceSpy,
            quizThemeRepoSpy,
        );
    });

    describe('execute', () => {
        it('should retrieve existing quiz themes from database anyway', async () => {
            await sut.execute();

            expect(quizThemeRepoSpy.calls.getQuizThemes.count).toBe(1);
        });

        describe('OpenAI API request cannot be made', () => {
            it('should directly return existing themes', async () => {
                stubGetQuizThemes(quizThemeRepoSpy, existingThemes);
                stubCannotGenerateQuizThemes(apiServiceSpy, true);

                const result = await sut.execute();

                expect(apiServiceSpy.calls.cannotGenerateQuizThemes.count).toBe(
                    1,
                );
                expect(result.themes).toEqual(existingThemes);
            });
        });

        describe('OpenAI API request can be made', () => {
            beforeEach(() => {
                stubGetQuizThemes(quizThemeRepoSpy, existingThemes);
                stubCannotGenerateQuizThemes(apiServiceSpy, false);
            });

            it('should generate new quiz themes', async () => {
                await sut.execute();

                expect(openAIServiceSpy.calls.generateThemesForQuiz.count).toBe(
                    1,
                );
            });

            it('should indicate that an OpenAI API request has been made', async () => {
                await sut.execute();

                expect(apiServiceSpy.calls.flagQuizThemeRequest.count).toBe(1);
            });

            it('should return both existing and generated quiz themes', async () => {
                stubGenerateThemesForQuiz(openAIServiceSpy, generatedThemes);

                const savedGeneratedThemes = mapToQuizThemes(generatedThemes);
                stubSaveGeneratedThemes(quizThemeRepoSpy, savedGeneratedThemes);

                const result = await sut.execute();

                expect(result.themes).toEqual([
                    ...existingThemes,
                    ...savedGeneratedThemes,
                ]);
            });
        });
    });
});
