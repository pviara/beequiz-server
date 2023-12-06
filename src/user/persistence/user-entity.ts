import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class UserPasswordDocument {
    @Prop({ required: true })
    hash!: string;

    @Prop({ required: true })
    salt!: string;
}

export class UserDocument extends Document {
    @Prop({ required: true })
    username!: string;

    @Prop({ required: true })
    password!: UserPasswordDocument;

    @Prop({ required: false })
    hasBeenWelcomed?: boolean;
}

export type UserEntity = UserDocument & Document;
export const userSchema = SchemaFactory.createForClass(UserDocument);

export const USER_MODEL = 'User';
