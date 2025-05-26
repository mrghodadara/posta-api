import { UserProvider, UserStatus } from './user.enum';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar?: string;
  provider: UserProvider;
  status?: UserStatus;
}
