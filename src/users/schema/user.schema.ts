import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserProvider, UserStatus } from '../interface/user.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true, unique: [true, 'Email already used'] })
  email: string;

  @Prop({ type: String, required: false })
  password: string;

  @Prop({ type: String, required: false })
  avatar?: string;

  @Prop({ type: String, required: true, enum: UserProvider })
  provider: string;

  @Prop({
    type: String,
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
