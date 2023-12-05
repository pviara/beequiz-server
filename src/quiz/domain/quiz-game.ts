import { QuizQuestion } from "./quiz-question";

export class QuizGame {
    constructor(
        readonly id: string,
        readonly userId: string,
        readonly questions: QuizQuestion[],
        readonly currentQuestionId: string,
        readonly score: number,
    ) {}
}

const game = new QuizGame(
    'id',
    'userId',
    [],
    'questionId',
    0
);