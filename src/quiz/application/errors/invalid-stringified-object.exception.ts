import { Exception, ExceptionCode } from '../../../application/exception';

export class InvalidStringifiedObjectException extends Exception {
    constructor(readonly message: string) {
        super(ExceptionCode.InvalidStringifiedObject);
    }
}
