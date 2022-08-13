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
import { ApiBody, ApiHeader, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RecruitService } from './recruit.service';
import { postPostRequestDto } from './dto/post-post-request.dto';
import {ApplyPostRequestDto, applyPostRequestDto} from './dto/apply-post-request.dto';

@Controller('recruit')
export class RecruitController {
  constructor(private readonly recruitService: RecruitService) {}

  @ApiOperation({ summary: '공고등록' })
  @ApiBody({ description: '공고등록 DTO ', type: postPostRequestDto })
  @Post()
  async postPost(@Body() postPostRequestDto) {
    return await this.recruitService.createPost();
  }

  @ApiOperation({ summary: '공고수정' })
  @ApiBody({ description: '공고수정 DTO ', type: postPostRequestDto })
  @Patch('/:postId')
  async patchPost(@Body() postPostRequestDto, @Param('postId') id: number) {
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
  @Post()
  @ApiBody({ description: '공고등록 DTO ', type: applyPostRequestDto })
  async applyPost(@Body() applyPostRequestDto: ApplyPostRequestDto) {
    return await this.recruitService.applyPost(applyPostRequestDto);
  }
}
