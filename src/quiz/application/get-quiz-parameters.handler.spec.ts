import {
    GetQuizParametersHandler,
    GetQuizParametersQuery,
} from './get-quiz-parameters.handler';
import { QuizParameters } from '../domain/quiz-parameters';
import { QuizParametersRepository } from '../persistence/quiz-parameter-repository';

describe('GetQuizParametersHandler', () => {
    let sut: GetQuizParametersHandler;
    let quizParametersRepositorySpy: QuizParametersRepositorySpy;

    beforeEach(() => {
        quizParametersRepositorySpy = new QuizParametersRepositorySpy();
        sut = new GetQuizParametersHandler(quizParametersRepositorySpy);
    });

    describe('execute', () => {
        it('should call quiz parameters repository to get quiz parameters', () => {
            const query = new GetQuizParametersQuery();

            sut.execute(query);

            expect(
                quizParametersRepositorySpy.calls.count.getQuizParameters,
            ).toBe(1);
        });
    });
});

class QuizParametersRepositorySpy implements QuizParametersRepository {
    calls = {
        count: {
            getQuizParameters: 0,
        },
    };

    getQuizParameters(): QuizParameters {
        this.calls.count.getQuizParameters++;
        return new QuizParameters([], []);
    }
}
