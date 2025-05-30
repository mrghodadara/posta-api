import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Posts } from './schema/posts.schema';
import mongoose, { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostStatus } from './interface/post.enum';
import { generateUniqueSlug } from 'src/utils/generateUniqueSlug';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Posts.name) private postsModel: Model<Posts>) {}

  async createPost(user: string, post: CreatePostDto) {
    try {
      const slug = await generateUniqueSlug(post.title, this.postsModel);

      const response = await this.postsModel.create({ ...post, slug, user });
      return {
        data: {
          post: response,
          message: 'Post created',
        },
      };
    } catch {
      throw new BadRequestException('Getting error while creating post');
    }
  }

  async getPosts() {
    try {
      const response = await this.postsModel
        .find({
          status: {
            $ne: PostStatus.DELETED,
          },
        })
        .populate('user', '-password')
        .exec();

      return {
        data: {
          posts: response,
        },
      };
    } catch {
      throw new BadRequestException('Getting error');
    }
  }

  async getPost(id: string) {
    try {
      const response = await this.postsModel.findById(id).populate('user');
      return {
        data: {
          post: response,
        },
      };
    } catch {
      throw new BadRequestException('Getting error');
    }
  }
  async getPostBySlug(slug: string) {
    try {
      const response = await this.postsModel
        .findOne({
          slug,
        })
        .populate('user');
      return {
        data: {
          post: response,
        },
      };
    } catch {
      throw new BadRequestException('Getting error');
    }
  }

  async getPostsByUser(user: string) {
    try {
      const response = await this.postsModel
        .find({
          user: new mongoose.Types.ObjectId(user),
          status: {
            $ne: PostStatus.DELETED,
          },
        })
        .populate('user', '-password')
        .exec();

      return {
        data: {
          posts: response,
        },
      };
    } catch {
      throw new BadRequestException('Getting error');
    }
  }

  async updatePost(id: string, post: UpdatePostDto) {
    try {
      const response = await this.postsModel.findByIdAndUpdate(id, {
        ...post,
      });
      return {
        data: {
          post: response,
          message: 'Post updated',
        },
      };
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
