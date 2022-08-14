import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { getManager, Repository, Connection } from 'typeorm';
import { Company } from '../entity/company.entity';
import { Post } from '../entity/post.entity';
import { Apply } from '../entity/apply.entity';
import { defaultCurrentDateTime, makeResponse } from '../config/function';
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

  async createPost(postPostRequestDto) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 객체를 생성하여 Post 생성
      const post = new Post();
      post.companyId = postPostRequestDto.companyId;
      post.position = postPostRequestDto.position;
      post.reward = postPostRequestDto.reward;
      post.text = postPostRequestDto.text;
      post.tech = postPostRequestDto.tech;
      post.createdAt = defaultCurrentDateTime();
      post.updatedAt = defaultCurrentDateTime();
      const postResult = await queryRunner.manager.save(post);

      const data = {
        companyId: postResult.companyId,
        position: postResult.position,
        reward: postResult.reward,
        text: postResult.text,
        tech: postResult.tech,
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

  async editPost(postPostRequestDto, id) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 공고 수정
      await queryRunner.manager.update(
        Post,
        { id: id },
        { position: postPostRequestDto.position },
      );

      await queryRunner.manager.update(
        Post,
        { id: id },
        { reward: postPostRequestDto.reward },
      );

      await queryRunner.manager.update(
        Post,
        { id: id },
        { text: postPostRequestDto.text },
      );

      await queryRunner.manager.update(
        Post,
        { id: id },
        { tech: postPostRequestDto.tech },
      );

      const data = {
        position: postPostRequestDto.position,
        reward: postPostRequestDto.reward,
        text: postPostRequestDto.text,
        tech: postPostRequestDto.tech,
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

  async deletePost(id) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 공고 삭제
      await queryRunner.manager.delete(Post, { id: id });

      const data = {
        id: id,
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

  async getPost(request) {
    try {
      // 공고 조회
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
      // postId에 해당하는 post 조회
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

      // 해당 채용공고의 회사 이름으로 회사 조회
      const company = await this.companyRepository.findOne({
        where: { name: queryResult.name },
      });

      // 회사의 채용공고 id 검색
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
      // 지원 여부 확인
      const isExistApply = await this.applyRepository.findOne({
        where: { userId: applyPostRequestDto.userId },
      });

      if (isExistApply) {
        return response.EXIST_APPLY_USER;
      }

      // 지원 생성
      const apply = new Apply();
      apply.userId = applyPostRequestDto.userId;
      apply.postId = applyPostRequestDto.postId;
      apply.createdAt = defaultCurrentDateTime();
      apply.updatedAt = defaultCurrentDateTime();
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
