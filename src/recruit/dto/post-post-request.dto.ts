import { ApiProperty, PickType } from '@nestjs/swagger';

export class postPostRequestDto {
  @ApiProperty({
    example: '백엔드 주니어 개발자',
    description: '포지션',
    required: true,
  })
  position: string;

  @ApiProperty({
    example: 150000,
    description: '보상',
    required: true,
  })
  reward: number;

  @ApiProperty({
    example: '원티드랩에서 백엔드 주니어 개발자를 채용합니다. ',
    description: '내용',
    required: true,
  })
  text: string;

  @ApiProperty({
    example: 'python',
    description: '기술',
    required: true,
  })
  tech: string;
}
