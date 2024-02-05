import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class UserPasswordDocument {
    @Prop({ type: String, required: true })
    hash!: string;

    @Prop({ type: String, required: true })
    salt!: string;
}

const userPasswordSchema = SchemaFactory.createForClass(UserPasswordDocument);

@Schema()
export class UserDocument extends Document {
    @Prop({ type: String, required: true })
    username!: string;

    @Prop({ type: userPasswordSchema, required: true })
    password!: UserPasswordDocument;

    @Prop({ type: Boolean, required: false })
    hasBeenWelcomed?: boolean;
}

export type UserEntity = UserDocument & Document;
export const userSchema = SchemaFactory.createForClass(UserDocument);

export const USER_MODEL = 'User';
