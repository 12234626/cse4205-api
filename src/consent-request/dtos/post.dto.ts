import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';

import { ConsentRequestEntity } from 'src/consent-request/entities/consent-request.entity';
import { UserDto } from 'src/user/dtos/user.dto';
import { PostImageDto } from './post-image.dto';
import { ConsentReviewDto } from 'src/consent-review/dtos/consent-review.dto';
import { ConsentRequestType } from 'src/consent-request/types/consent-request-type.type';

export class PostDto {
  @ApiProperty({ description: '퀘스트 승인 요청 ID' })
  consentRequestId: number;

  @ApiProperty({
    enum: ConsentRequestType,
    description: '승인 요청 타입',
  })
  @IsEnum(ConsentRequestType)
  requestType: ConsentRequestType;

  @ApiPropertyOptional({ description: '제목' })
  @IsString()
  @IsOptional()
  title: string | null;

  @ApiPropertyOptional({ description: '본문' })
  @IsString()
  @IsOptional()
  content: string | null;

  @ApiProperty({ description: '생성일 (유닉스 시간)' })
  createdAt: number;

  @ApiProperty({ description: '수정일 (유닉스 시간)' })
  updatedAt: number;

  @ApiProperty({ description: '작성자', type: () => UserDto })
  author: UserDto;

  @ApiProperty({ description: '이미지 목록', type: () => [PostImageDto] })
  images: PostImageDto[];

  @ApiProperty({ description: '리뷰 목록', type: () => [ConsentReviewDto] })
  reviews: ConsentReviewDto[];

  @ApiProperty({ description: '사용자 퀘스트 ID' })
  userQuestId: number;

  constructor(consentRequest: ConsentRequestEntity) {
    this.consentRequestId = consentRequest.consentRequestId;
    this.requestType = consentRequest.requestType;
    this.title = consentRequest.title;
    this.content = consentRequest.content;
    this.createdAt = consentRequest.createdAt.getTime();
    this.updatedAt = consentRequest.updatedAt.getTime();
    this.author = new UserDto(consentRequest.author);
    this.images = consentRequest.images.map((image) => new PostImageDto(image));
    this.reviews = consentRequest.reviews.map(
      (review) => new ConsentReviewDto(review),
    );
    this.userQuestId = consentRequest.userQuest.userQuestId;
  }
}
