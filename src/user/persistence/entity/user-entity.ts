import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserDocument extends Document {
    @Prop({ type: String, required: true })
    email!: string;

    @Prop({ type: Boolean, required: false })
    hasBeenWelcomed?: boolean;
}

export type UserEntity = UserDocument & Document;
export const userSchema = SchemaFactory.createForClass(UserDocument);

export const USER_MODEL = 'User';
