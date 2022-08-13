import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { getManager, Repository, Connection } from 'typeorm';
import { Company } from '../entity/company.entity';
import { Post } from '../entity/post.entity';
import { Apply } from '../entity/apply.entity';
import { makeResponse } from '../config/function';
import { response } from '../config/response.utils';

@Injectable()
export class RecruitService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(Apply)
    private applyRepository: Repository<Apply>,
    private connection: Connection,
  ) {}

  async createPost() {
    try {
      // const ticketCount = await getManager()
      //   .createQueryBuilder(User, 'user')
      //   .select('ticket.id')
      //   .where('ticket.isSuccess IN (:isSuccess)', { isSuccess: 'NotSuccess' })
      //   .getMany();

      const data = {};

      // const result = makeResponse(response.SUCCESS, data);

      // return result;
    } catch (error) {
      // return response.ERROR;
    }
  }

  async editPost() {
    try {
      // const ticketCount = await getManager()
      //   .createQueryBuilder(User, 'user')
      //   .select('ticket.id')
      //   .where('ticket.isSuccess IN (:isSuccess)', { isSuccess: 'NotSuccess' })
      //   .getMany();

      const data = {};

      // const result = makeResponse(response.SUCCESS, data);

      // return result;
    } catch (error) {
      // return response.ERROR;
    }
  }

  async deletePost() {
    try {
      // const ticketCount = await getManager()
      //   .createQueryBuilder(User, 'user')
      //   .select('ticket.id')
      //   .where('ticket.isSuccess IN (:isSuccess)', { isSuccess: 'NotSuccess' })
      //   .getMany();

      const data = {};

      // const result = makeResponse(response.SUCCESS, data);

      // return result;
    } catch (error) {
      // return response.ERROR;
    }
  }

  async getPost(request) {
    try {
      const queryResult = await getManager()
        .createQueryBuilder(Post, 'post')
        .leftJoin(Company, 'company', 'post.companyId = company.id')
        .select([
          'post.id as postId',
          'post.position as position',
          'post.reward as reward',
          'post.tech as tech',
        ])
        .addSelect([
          'company.name as name',
          'company.country as country',
          'company.region as region',
        ]);

      // 검색
      if (request.query.keyword) {
        await queryResult.orWhere('post.position like :keyword', {
          keyword: `%${request.query.keyword}%`,
        });
        await queryResult.orWhere('post.reward like :keyword', {
          keyword: `%${request.query.keyword}%`,
        });
        await queryResult.orWhere('post.tech like :keyword', {
          keyword: `%${request.query.keyword}%`,
        });
        await queryResult.orWhere('company.name like :keyword', {
          keyword: `%${request.query.keyword}%`,
        });
        await queryResult.orWhere('company.country like :keyword', {
          keyword: `%${request.query.keyword}%`,
        });
        await queryResult.orWhere('company.region like :keyword', {
          keyword: `%${request.query.keyword}%`,
        });
      }

      const post = await queryResult.getRawMany();

      const result = makeResponse(response.SUCCESS, post);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }

  async getPostByPostId(id) {
    try {
      const queryResult = await getManager()
        .createQueryBuilder(Post, 'post')
        .leftJoin(Company, 'company', 'post.companyId = company.id')
        .where('post.id In (:postId)', { postId: id })
        .select([
          'post.id as postId',
          'post.position as position',
          'post.reward as reward',
          'post.tech as tech',
          'post.text as text',
        ])
        .addSelect([
          'company.name as name',
          'company.country as country',
          'company.region as region',
        ])
        .getRawOne();

      const company = await this.companyRepository.findOne({
        where: { name: queryResult.name },
      });

      const companyPosts = await getManager()
        .createQueryBuilder(Post, 'post')
        .where('post.companyId In (:companyId)', { companyId: company.id })
        .select('post.id')
        .getMany();

      const companyPostList = [];

      companyPosts.map((post) => {
        if (post) {
          companyPostList.push(post.id);
        }
      });

      const data = {
        ...queryResult,
        companyPost: companyPostList,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }

  async applyPost(applyPostRequestDto) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const isExistApply = await this.postRepository.findOne({
        where: { userId: applyPostRequestDto.userId },
      });

      if (isExistApply) {
        return response.EXIST_APPLY_USER;
      }

      const apply = new Apply();
      apply.userId = applyPostRequestDto.userId;
      apply.postId = applyPostRequestDto.postId;
      const applyResult = await queryRunner.manager.save(apply);

      const data = {
        userId: applyResult.userId,
        postId: applyResult.postId,
      };

      const result = makeResponse(response.SUCCESS, data);

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      // Rollback
      await queryRunner.rollbackTransaction();
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }
}
