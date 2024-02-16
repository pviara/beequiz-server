import { QuizGame } from '../../domain/quiz-game';

export class GameLastQuestionAnsweredEvent {
    constructor(
        readonly game: QuizGame,
        readonly finalScore: number,
    ) {}
}
