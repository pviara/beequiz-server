import { Exception } from '../../../application/exception';

export class ProblemOccurredWithOpenAIException extends Exception {
    readonly message =
        'A problem occurred when generating data with OpenAI API.';

    constructor() {
        super('ProblemOccurredWithOpenAI');
    }
}
