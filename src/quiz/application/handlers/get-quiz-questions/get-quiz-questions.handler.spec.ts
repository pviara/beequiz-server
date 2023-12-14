import {
    ApiServiceSpy,
    stubCannotGenerateQuizQuestions,
} from '../test/api-service.spy';
import { ExceededAPIQuotaException } from '../../../../open-ai/application/errors/exceeded-api-quota.exception';
import {
    GetQuizQuestionsCommand,
    GetQuizQuestionsHandler,
} from './get-quiz-questions.handler';
import {
    makeGenerateQuestionsForQuizThrow,
    OpenAIServiceSpy,
    stubGenerateQuestionsForQuiz,
} from '../test/open-ai-api-service.spy';
import {
    mapToQuizQuestions,
    QuizQuestionRepositorySpy,
    stubGetQuizQuestions,
    stubSaveGeneratedQuestions,
} from '../test/quiz-question-repository.spy';
import { ParsedQuizQuestion } from '../../quiz-parser/model/parsed-quiz-question';
import { ProblemOccurredWithOpenAIException } from '../../errors/problem-occurred-with-openai.exception';
import { QuizQuestion } from '../../../domain/quiz-question';
import { QuizTheme } from '../../../domain/quiz-parameters';
import { QuizThemeNotFoundException } from '../../errors/quiz-theme-not-found.exception';
import {
    QuizThemeRepositorySpy,
    stubGetQuizTheme,
} from '../test/quiz-theme-repository.spy';

describe('GetQuizQuestionsHandler', () => {
    let sut: GetQuizQuestionsHandler;

    let apiServiceSpy: ApiServiceSpy;
    let openAIServiceSpy: OpenAIServiceSpy;
    let quizQuestionRepoSpy: QuizQuestionRepositorySpy;
    let quizThemeRepoSpy: QuizThemeRepositorySpy;

    const existingQuestions: QuizQuestion[] = [
        new QuizQuestion('id1', 'label1', []),
        new QuizQuestion('id2', 'label2', []),
        new QuizQuestion('id3', 'label3', []),
    ];

    const existingTheme = new QuizTheme('id', 'code', 'label');

    const generatedQuestions: ParsedQuizQuestion[] = [
        new ParsedQuizQuestion('label1', []),
        new ParsedQuizQuestion('label2', []),
        new ParsedQuizQuestion('label3', []),
    ];

    beforeEach(() => {
        apiServiceSpy = new ApiServiceSpy();
        openAIServiceSpy = new OpenAIServiceSpy();
        quizQuestionRepoSpy = new QuizQuestionRepositorySpy();
        quizThemeRepoSpy = new QuizThemeRepositorySpy();

        sut = new GetQuizQuestionsHandler(
            apiServiceSpy,
            openAIServiceSpy,
            quizQuestionRepoSpy,
            quizThemeRepoSpy,
        );
    });

    describe('execute', () => {
        it('should retrieve quiz related theme using given themeId', async () => {
            const command = new GetQuizQuestionsCommand(5, existingTheme.id);

            stubGetQuizTheme(quizThemeRepoSpy, existingTheme);

            await sut.execute(command);

            expect(quizThemeRepoSpy.calls.getQuizTheme.count).toBe(1);
            expect(quizThemeRepoSpy.calls.getQuizTheme.history).toContain(
                command.themeId,
            );
        });

        it('should throw an error when no quiz related theme is found', async () => {
            const command = new GetQuizQuestionsCommand(5, 'theme_id');

            stubGetQuizTheme(quizThemeRepoSpy, null);

            await expect(sut.execute(command)).rejects.toThrow(
                QuizThemeNotFoundException,
            );
        });

        it('should retrieve existing quiz questions from database anyway', async () => {
            const command = new GetQuizQuestionsCommand(5, existingTheme.id);

            stubGetQuizTheme(quizThemeRepoSpy, existingTheme);

            await sut.execute(command);

            expect(quizQuestionRepoSpy.calls.getQuizQuestions.count).toBe(1);
            expect(
                quizQuestionRepoSpy.calls.getQuizQuestions.history,
            ).toContainEqual([command.numberOfQuestions, existingTheme.id]);
        });

        describe('OpenAI API request cannot be made', () => {
            beforeEach(() => {
                stubGetQuizTheme(quizThemeRepoSpy, existingTheme);
                stubCannotGenerateQuizQuestions(apiServiceSpy, true);
            });

            it('should directly return existing questions', async () => {
                const command = new GetQuizQuestionsCommand(
                    existingQuestions.length,
                    existingTheme.id,
                );

                stubGetQuizQuestions(quizQuestionRepoSpy, existingQuestions);

                const result = await sut.execute(command);

                expect(
                    apiServiceSpy.calls.cannotGenerateQuizQuestions.count,
                ).toBe(1);

                expect(result).toEqual(existingQuestions);
            });

            it('should still generate new quiz questions when there are not enough', async () => {
                const command = new GetQuizQuestionsCommand(
                    3,
                    existingTheme.id,
                );

                const slicedQuestions = existingQuestions.slice(2);

                stubGetQuizQuestions(quizQuestionRepoSpy, slicedQuestions);

                await sut.execute(command);

                expect(
                    openAIServiceSpy.calls.generateQuestionsForQuiz.count,
                ).toBe(1);

                expect(
                    openAIServiceSpy.calls.generateQuestionsForQuiz.history,
                ).toContainEqual([
                    slicedQuestions,
                    command.numberOfQuestions,
                    existingTheme.label,
                ]);

                expect(apiServiceSpy.calls.flagQuizQuestionRequest.count).toBe(
                    1,
                );
            });
        });

        describe('OpenAI API request can be made', () => {
            beforeEach(() => {
                stubGetQuizTheme(quizThemeRepoSpy, existingTheme);
                stubCannotGenerateQuizQuestions(apiServiceSpy, false);
                stubGetQuizQuestions(quizQuestionRepoSpy, existingQuestions);
            });

            it('should save generated questions', async () => {
                const command = new GetQuizQuestionsCommand(
                    existingQuestions.length,
                    existingTheme.id,
                );

                stubGenerateQuestionsForQuiz(
                    openAIServiceSpy,
                    generatedQuestions,
                );

                await sut.execute(command);

                expect(
                    quizQuestionRepoSpy.calls.saveGeneratedQuestions.count,
                ).toBe(1);

                expect(
                    quizQuestionRepoSpy.calls.saveGeneratedQuestions.history,
                ).toContainEqual([generatedQuestions, existingTheme.id]);
            });

            it('should indicate that an OpenAI API request has been made', async () => {
                const command = new GetQuizQuestionsCommand(
                    existingQuestions.length,
                    existingTheme.id,
                );

                await sut.execute(command);

                expect(apiServiceSpy.calls.flagQuizQuestionRequest.count).toBe(
                    1,
                );
            });

            it('should only return generated questions', async () => {
                const command = new GetQuizQuestionsCommand(
                    existingQuestions.length,
                    existingTheme.id,
                );

                stubGenerateQuestionsForQuiz(
                    openAIServiceSpy,
                    generatedQuestions,
                );

                const savedQuestions = mapToQuizQuestions(generatedQuestions);
                stubSaveGeneratedQuestions(quizQuestionRepoSpy, savedQuestions);

                const result = await sut.execute(command);

                expect(result).toEqual(savedQuestions);
            });

            describe('An error is thrown from OpenAIService', () => {
                const numberOfTimesErrorShouldBeThrown = 1;

                it('should return existing questions when there are enough of them', async () => {
                    makeGenerateQuestionsForQuizThrow(
                        openAIServiceSpy,
                        new Error(),
                        numberOfTimesErrorShouldBeThrown,
                    );

                    const command = new GetQuizQuestionsCommand(
                        existingQuestions.length,
                        existingTheme.id,
                    );

                    const result = await sut.execute(command);

                    expect(result).toEqual(existingQuestions);
                });

                it('should throw an error when caught error from OpenAI service is exceeded quota', async () => {
                    makeGenerateQuestionsForQuizThrow(
                        openAIServiceSpy,
                        new ExceededAPIQuotaException(),
                        numberOfTimesErrorShouldBeThrown,
                    );

                    const command = new GetQuizQuestionsCommand(
                        existingQuestions.length + 10,
                        existingTheme.id,
                    );

                    await expect(sut.execute(command)).rejects.toThrow(
                        ProblemOccurredWithOpenAIException,
                    );
                });

                it('should try to generate questions again and again as long as error is not exceeded quota', async () => {
                    const numberOfTimesErrorShouldBeThrown = 3;

                    makeGenerateQuestionsForQuizThrow(
                        openAIServiceSpy,
                        new Error(),
                        numberOfTimesErrorShouldBeThrown,
                    );

                    const command = new GetQuizQuestionsCommand(
                        existingQuestions.length + 10,
                        existingTheme.id,
                    );

                    await sut.execute(command);

                    expect(
                        openAIServiceSpy.calls.generateQuestionsForQuiz.count,
                    ).toBe(numberOfTimesErrorShouldBeThrown + 1);
                });
            });
        });
    });
});
