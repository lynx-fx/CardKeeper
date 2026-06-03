import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateImageDto, CreateImageResposeDto, DeleteImageResponseDto, GetImagesResponseDto } from './dto/image.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user-service/user-service.service';
import { Card, Image, User } from '@prisma/client';
import e from 'express';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class ImageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly s3Service: S3Service
  ) { };

  async create(userId: number, createImageDto: CreateImageDto, files: any): Promise<CreateImageResposeDto> {
    if (!files?.length) throw new BadRequestException({ success: false, message: "No images provided" });

    // verify card exists to the user
    const card = await this.prisma.card.findFirst({
      where: {
        cardId: createImageDto.cardId,
        user: {
          userId
        },
      },
    });

    if (!card) throw new NotFoundException({ success: false, message: "Card not found" });

    const imageUris = await Promise.all(
      files.map(async (file) => {
        const key = `cards/${card.userId}/${Date.now()}-${file.originalname}`;
        return this.s3Service.uploadFile(file, key);
      })
    );

    //create iamge
    await this.prisma.$transaction(async (tx) => {
      await tx.image.createMany({
        data: imageUris.map((url) => ({
          cardId: card.cardId,
          imageUri: url,
        })),
      });
    });

    return { success: true, message: "added images" }
  }

  async findByCardId(userId: number, cardId: number): Promise<GetImagesResponseDto> {
    const card = await this.prisma.card.findFirst({ where: { cardId, userId } });

    if (!card) throw new NotFoundException({ success: false, message: "Images not found" });

    const images = await this.prisma.image.findMany({
      where: { cardId }
    })

    return { success: true, images, message: "Images fetched." }
  }

  async remove(userId: number, imageIds: number[]): Promise<DeleteImageResponseDto> {
    if (imageIds.length === 0) throw new BadRequestException({ success: false, message: "No images provided" });

    const [images] = await this.prisma.$transaction([
      this.prisma.image.findMany({
        where: {
          imageId: {
            in: imageIds
          },
          card: { userId }
        },
      }),
      this.prisma.image.deleteMany({
        where: {
          imageId: {
            in: imageIds
          },
          card: { userId }
        }
      })
    ]);

    void Promise.allSettled(
      images.map((image) => this.s3Service.deleteFile(image.imageUri))
    );
    return { success: true, message: "Image deleted" }
  }
}
