import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class DatabaseService implements MongooseOptionsFactory {
  constructor(private readonly configSerivce: ConfigService) {}
  createMongooseOptions():
    | Promise<MongooseModuleOptions>
    | MongooseModuleOptions {
    const user = this.configSerivce.get<string>('DATABASE_USER');
    const password = this.configSerivce.get<string>('DATABASE_PASSWORD');
    const host = this.configSerivce.get<string>('DATABASE_HOST');
    const name = this.configSerivce.get<string>('DATABASE_NAME');

    return {
      // uri: `mongodb+srv://${user}:${password}@${host}/${name}?retryWrites=true&w=majority&appName=Cluster0`,
      uri: `mongodb+srv://vgghodadara2003:Vivek20032003Vivek@cluster0.kg2wkkh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
      retryAttempts: 5,
    };
  }
}
