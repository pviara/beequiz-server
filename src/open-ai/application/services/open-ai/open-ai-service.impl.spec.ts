import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources';
import OpenAI from 'openai';
import { OpenAIObjectFactory } from '../../../../open-ai/application/open-ai-object-factory/open-ai-object-factory';
import { OpenAIServiceImpl } from './open-ai-service.impl';
import { PromptService } from '../prompt/prompt-service';
import { QuizParser } from '../../../../quiz/application/quiz-parser/quiz-parser';
import { QuizQuestion } from '../../../../quiz/domain/quiz-question';
import { QuizTheme } from '../../../../quiz/domain/quiz-parameters';

const DEFAULT_DUMMY_CHOICE = '{"winner": "Los Angeles Dodgers"}';

describe('OpenAIServiceImpl', () => {
    let sut: OpenAIServiceImpl;

    let openAIObjectFactorySpy: OpenAIObjectFactorySpy;
    let promptServiceSpy: PromptServiceSpy;
    let quizQuestionsParserSpy: QuizQuestionsParserSpy;

    beforeEach(() => {
        openAIObjectFactorySpy = new OpenAIObjectFactorySpy();
        promptServiceSpy = new PromptServiceSpy();
        quizQuestionsParserSpy = new QuizQuestionsParserSpy();

        sut = new OpenAIServiceImpl(
            openAIObjectFactorySpy,
            promptServiceSpy,
            quizQuestionsParserSpy,
        );
    });

    describe('generateQuestionsForQuiz', () => {
        it('should get appropriate prompt from prompt service', async () => {
            stubCreateOpenAIObject(openAIObjectFactorySpy);

            const savedQuizQuestions: QuizQuestion[] = [];
            const numberOfQuestions = 10;
            const themeLabel = 'sport';
            await sut.generateQuestionsForQuiz(
                savedQuizQuestions,
                numberOfQuestions,
                themeLabel,
            );

            expect(promptServiceSpy.calls.getQuizQuestionsPrompt.count).toBe(1);
            expect(
                promptServiceSpy.calls.getQuizQuestionsPrompt.history,
            ).toContainEqual([
                savedQuizQuestions,
                numberOfQuestions,
                themeLabel,
            ]);
        });

        it('should call openai API using retrieved prompt', async () => {
            const prompt = 'prompt';
            stubGetQuizQuestionsPrompt(promptServiceSpy, prompt);

            stubCreateOpenAIObject(openAIObjectFactorySpy);

            await sut.generateQuestionsForQuiz([], 10, 'music');

            expect(openAIObjectFactorySpy.calls.createOpenAIObject.count).toBe(
                1,
            );
            expect(
                openAIObjectFactorySpy.calls.createOpenAIObject.created.create
                    .count,
            ).toBe(1);

            const params: ChatCompletionCreateParamsNonStreaming = {
                model: 'gpt-3.5-turbo-1106',
                response_format: { type: 'json_object' },
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            };
            expect(
                openAIObjectFactorySpy.calls.createOpenAIObject.created.create
                    .history,
            ).toContainEqual(params);

            expect(quizQuestionsParserSpy.calls.parseQuizQuestions.count).toBe(
                1,
            );
            expect(
                quizQuestionsParserSpy.calls.parseQuizQuestions.history,
            ).toContain(DEFAULT_DUMMY_CHOICE);
        });
    });

    describe('generateThemesForQuiz', () => {
        it('should get appropriate prompt from prompt service', async () => {
            stubCreateOpenAIObject(openAIObjectFactorySpy);

            const savedQuizThemes: QuizTheme[] = [];
            await sut.generateThemesForQuiz(savedQuizThemes);

            expect(promptServiceSpy.calls.getQuizThemesPrompt.count).toBe(1);
            expect(
                promptServiceSpy.calls.getQuizThemesPrompt.history,
            ).toContainEqual(savedQuizThemes);
        });

        it('should call openai API using retrieved prompt', async () => {
            const prompt = 'prompt';
            stubGetQuizThemesPrompt(promptServiceSpy, prompt);

            stubCreateOpenAIObject(openAIObjectFactorySpy);

            await sut.generateThemesForQuiz([]);

            expect(openAIObjectFactorySpy.calls.createOpenAIObject.count).toBe(
                1,
            );
            expect(
                openAIObjectFactorySpy.calls.createOpenAIObject.created.create
                    .count,
            ).toBe(1);

            const params: ChatCompletionCreateParamsNonStreaming = {
                model: 'gpt-3.5-turbo-1106',
                response_format: { type: 'json_object' },
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            };
            expect(
                openAIObjectFactorySpy.calls.createOpenAIObject.created.create
                    .history,
            ).toContainEqual(params);

            expect(quizQuestionsParserSpy.calls.parseQuizThemes.count).toBe(1);
            expect(
                quizQuestionsParserSpy.calls.parseQuizThemes.history,
            ).toContain(DEFAULT_DUMMY_CHOICE);
        });
    });
});

class OpenAIObjectFactorySpy implements OpenAIObjectFactory {
    calls = {
        createOpenAIObject: {
            count: 0,

            created: {
                create: {
                    count: 0,
                    history: [] as ChatCompletionCreateParamsNonStreaming[],
                },
            },
        },
    };

    createOpenAIObject(): OpenAI {
        this.calls.createOpenAIObject.count++;
        return {} as OpenAI;
    }
}

class PromptServiceSpy implements PromptService {
    calls = {
        getQuizQuestionsPrompt: {
            count: 0,
            history: [] as [QuizQuestion[], number, string][],
        },
        getQuizThemesPrompt: {
            count: 0,
            history: [] as QuizTheme[][],
        },
    };

    getQuizQuestionsPrompt(
        savedQuizQuestions: QuizQuestion[],
        numberOfQuestions: number,
        themeLabel: string,
    ): string {
        this.calls.getQuizQuestionsPrompt.count++;
        this.calls.getQuizQuestionsPrompt.history.push([
            savedQuizQuestions,
            numberOfQuestions,
            themeLabel,
        ]);
        return '';
    }

    getQuizThemesPrompt(savedQuizThemes: QuizTheme[]): string {
        this.calls.getQuizThemesPrompt.count++;
        this.calls.getQuizThemesPrompt.history.push(savedQuizThemes);
        return '';
    }
}

class QuizQuestionsParserSpy implements QuizParser {
    calls = {
        parseQuizQuestions: {
            count: 0,
            history: [] as string[],
        },
        parseQuizThemes: {
            count: 0,
            history: [] as string[],
        },
    };

    parseQuizQuestions(stringifiedObject: string): QuizQuestion[] {
        this.calls.parseQuizQuestions.count++;
        this.calls.parseQuizQuestions.history.push(stringifiedObject);
        return [];
    }

    parseQuizThemes(stringifiedObject: string): QuizTheme[] {
        this.calls.parseQuizThemes.count++;
        this.calls.parseQuizThemes.history.push(stringifiedObject);
        return [];
    }
}

function stubCreateOpenAIObject(
    openAIObjectFactorySpy: OpenAIObjectFactorySpy,
): void {
    openAIObjectFactorySpy.createOpenAIObject = () => {
        openAIObjectFactorySpy.calls.createOpenAIObject.count++;
        return {
            chat: {
                completions: {
                    create: (
                        params: ChatCompletionCreateParamsNonStreaming,
                    ) => {
                        openAIObjectFactorySpy.calls.createOpenAIObject.created
                            .create.count++;
                        openAIObjectFactorySpy.calls.createOpenAIObject.created.create.history.push(
                            params,
                        );

                        return {
                            choices: [
                                {
                                    message: {
                                        role: 'assistant',
                                        content: DEFAULT_DUMMY_CHOICE,
                                    },
                                },
                            ],
                        };
                    },
                },
            },
        } as unknown as OpenAI;
    };
}

function stubGetQuizQuestionsPrompt(
    promptServiceSpy: PromptServiceSpy,
    returnedValue: string,
): void {
    promptServiceSpy.getQuizQuestionsPrompt = (
        savedQuizQuestions: QuizQuestion[],
        numberOfQuestions: number,
        themeLabel: string,
    ) => {
        promptServiceSpy.calls.getQuizQuestionsPrompt.count++;
        promptServiceSpy.calls.getQuizQuestionsPrompt.history.push([
            savedQuizQuestions,
            numberOfQuestions,
            themeLabel,
        ]);
        return returnedValue;
    };
}

function stubGetQuizThemesPrompt(
    promptServiceSpy: PromptServiceSpy,
    returnedValue: string,
): void {
    promptServiceSpy.getQuizThemesPrompt = (savedQuizThemes: QuizTheme[]) => {
        promptServiceSpy.calls.getQuizThemesPrompt.count++;
        promptServiceSpy.calls.getQuizThemesPrompt.history.push(
            savedQuizThemes,
        );
        return returnedValue;
    };
}
