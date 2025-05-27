import { PostStatus } from './post.enum';

export interface IUser {
  title: string;
  description: string;
  status: PostStatus;
}
