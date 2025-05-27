import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Posts } from './schema/posts.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostStatus } from './interface/post.enum';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Posts.name) private postsModel: Model<Posts>) {}

  async createPost(user: string, post: CreatePostDto) {
    try {
      const response = await this.postsModel.create({ ...post, user });
      return response;
    } catch {
      throw new BadRequestException('Getting error while creating post');
    }
  }

  async getPosts() {
    try {
      const response = await this.postsModel.find();
      return response;
    } catch {
      throw new BadRequestException('Getting error');
    }
  }

  async getPost(id: string) {
    try {
      const response = await this.postsModel.findById(id);
      return response;
    } catch {
      throw new BadRequestException('Getting error');
    }
  }

  async updatePost(id: string, post: UpdatePostDto) {
    try {
      const response = await this.postsModel.findByIdAndUpdate(id, {
        ...post,
      });
      return response;
    } catch {
      throw new BadRequestException('Getting error');
    }
  }

  async deletePost(id: string) {
    try {
      await this.postsModel.findByIdAndUpdate(id, {
        status: PostStatus.DELETED,
      });

      return {
        data: {
          message: 'Post deleted',
        },
      };
    } catch {
      throw new BadRequestException('Getting error');
    }
  }
}
