import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QuizParametersRepository } from '../persistence/quiz-parameter-repository';

export class GetQuizParametersQuery implements IQuery {}

@QueryHandler(GetQuizParametersQuery)
export class GetQuizParametersHandler
    implements IQueryHandler<GetQuizParametersQuery>
{
    constructor(private repo: QuizParametersRepository) {}

    execute(query: GetQuizParametersQuery): any {
        return this.repo.getQuizParameters();
    }
}
