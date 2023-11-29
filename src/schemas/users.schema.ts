import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ unique: true })
  phone: string;

  @Prop()
  password: string;

  @Prop()
  smsOtp: number;

  @Prop()
  smsOtpTime: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
