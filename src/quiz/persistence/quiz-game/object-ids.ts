import { Types } from 'mongoose';

export class ObjectIds {
    constructor(readonly ids: Types.ObjectId[]) {
        ids = ids.map((id) => new Types.ObjectId(id));
    }

    toStrings(): string[] {
        return this.ids.map((id) => id.toString());
    }
}
