import {
  Body,
  Controller,
  Request,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RecruitService } from './recruit.service';
import { PostPostRequestDto } from './dto/post-post-request.dto';
import { ApplyPostRequestDto } from './dto/apply-post-request.dto';

@Controller('recruit')
export class RecruitController {
  constructor(private readonly recruitService: RecruitService) {}

  @ApiOperation({ summary: '공고등록' })
  @ApiBody({ description: '공고등록 DTO ', type: PostPostRequestDto })
  @Post()
  async postPost(@Body() postPostRequestDto: PostPostRequestDto) {
    return await this.recruitService.createPost(postPostRequestDto);
  }

  @ApiOperation({ summary: '공고수정' })
  @ApiBody({ description: '공고수정 DTO ', type: PostPostRequestDto })
  @Patch('/:postId')
  async patchPost(
    @Body() postPostRequestDto: PostPostRequestDto,
    @Param('postId') id: number,
  ) {
    return await this.recruitService.editPost();
  }

  @ApiOperation({ summary: '공고삭제' })
  @Delete('/:postId')
  async deletePost(@Param('postId') id: number) {
    return await this.recruitService.deletePost();
  }

  @ApiOperation({ summary: '공고조회' })
  @ApiQuery({ name: 'keyword', required: false })
  @Get()
  async getPost(@Request() req) {
    return await this.recruitService.getPost(req);
  }

  @ApiOperation({ summary: '공고 상세 조회' })
  @Get('/:postId')
  async getPostByPostId(@Param('postId') id: number) {
    return await this.recruitService.getPostByPostId(id);
  }

  @ApiOperation({ summary: '공고지원' })
  @Post('/apply')
  @ApiBody({ description: '공고등록 DTO ', type: ApplyPostRequestDto })
  async applyPost(@Body() applyPostRequestDto: ApplyPostRequestDto) {
    return await this.recruitService.applyPost(applyPostRequestDto);
  }
}
