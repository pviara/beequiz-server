import { CorrectAnswerGivenEvent } from '../../events/correct-answer-given.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(CorrectAnswerGivenEvent)
export class CorrectAnswerGivenEventHandler
    implements IEventHandler<CorrectAnswerGivenEvent>
{
    handle(event: CorrectAnswerGivenEvent) {
        throw new Error('Method not implemented.');
    }
}
