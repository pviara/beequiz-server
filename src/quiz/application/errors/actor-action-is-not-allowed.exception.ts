import { Exception } from '../../../application/exception';

export class ActorActionIsNotAllowedException extends Exception {
    constructor(actorId: string) {
        super('ActorActionIsNotAllowed');
        this.message = this.formatMessage(actorId);
    }

    private formatMessage(userId: string): string {
        return `User with id "${userId}" tried to perform an action they are not allowed to.`;
    }
}
