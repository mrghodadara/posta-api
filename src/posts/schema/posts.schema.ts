import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PostStatus } from '../interface/post.enum';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Posts {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @Prop({ type: [String], required: true })
  tags: string[];

  @Prop({ type: String, enum: PostStatus, default: PostStatus.ACTIVE })
  status: PostStatus;
}

export const PostsSchema = SchemaFactory.createForClass(Posts);
