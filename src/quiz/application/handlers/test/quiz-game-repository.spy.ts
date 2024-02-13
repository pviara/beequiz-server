import { QuizGameRepository } from '../../../persistence/quiz-game/repository/quiz-game-repository';
import { QuizGame } from 'src/quiz/domain/quiz-game';

export class QuizGameRepositorySpy implements QuizGameRepository {
    calls = {
        getOnGoingGame: {
            count: 0,
            history: [] as string[],
        },
    };

    async getOnGoingGame(userId: string): Promise<QuizGame | null> {
        this.calls.getOnGoingGame.count++;
        this.calls.getOnGoingGame.history.push(userId);
        return null;
    }
    createGame(userId: string, questionIds: string[]): Promise<void> {
        throw new Error('Method not implemented.');
    }
    deleteGame(gameId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    updateGame(game: QuizGame): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

export function stubGetOnGoingGameQuestion(
    quizGameRepoSpy: QuizGameRepositorySpy,
    returnedValue: QuizGame | null,
): void {
    quizGameRepoSpy.getOnGoingGame = (
        userId: string,
    ): Promise<QuizGame | null> => {
        quizGameRepoSpy.calls.getOnGoingGame.count++;
        quizGameRepoSpy.calls.getOnGoingGame.history.push(userId);
        return Promise.resolve(returnedValue);
    };
}
