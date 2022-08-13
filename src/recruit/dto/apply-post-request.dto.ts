import { ApiProperty } from '@nestjs/swagger';

export class ApplyPostRequestDto {
  @ApiProperty({
    example: 1,
    description: '유저id',
    required: true,
  })
  userId: number;

  @ApiProperty({
    example: 1,
    description: '공고Id',
    required: true,
  })
  postId: number;
}
