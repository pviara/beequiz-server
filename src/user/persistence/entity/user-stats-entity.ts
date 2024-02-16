import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'user-stats' })
export class UserStatsDocument extends Document {
    @Prop({ type: Types.ObjectId, required: true })
    userId!: Types.ObjectId;

    @Prop({ type: Number, default: 0 })
    score!: number;

    @Prop({ type: Number, default: 0 })
    answers!: number;
}

export type UserStatsEntity = UserStatsDocument & Document;
export const userStatsSchema = SchemaFactory.createForClass(UserStatsDocument);

export const USER_STATS_MODEL = 'UserStats';
