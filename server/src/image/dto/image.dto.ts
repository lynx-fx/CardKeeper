import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsInt, IsArray, IsIn } from 'class-validator';

export class imageModel {
  @ApiProperty()
  imageUri!: string;
  @ApiProperty()
  cardId!: number;
}

export class CreateImageDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  cardId!: number;
}

export class DeleteImageDto {
  @ApiProperty()
  @IsArray()
  @IsInt({each: true})
  iamgeIds!: number[];
}

export class CreateImageResposeDto {
  @ApiProperty()
  success!: boolean;
  @ApiProperty()
  message!: string
}

export class GetImagesResponseDto {
  @ApiProperty()
  success!: boolean;
  @ApiProperty()
  images!: imageModel[];
  @ApiProperty()
  message!: string
}

export class DeleteImageResponseDto {
  @ApiProperty()
  success!: boolean;
  @ApiProperty()
  message!: string
}
