import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto, CreateImageResposeDto, DeleteImageDto, DeleteImageResponseDto, GetImagesResponseDto } from './dto/image.dto';
import { JwtGuard } from '../../guard/jwtVerifyGuard';
import { ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) { }

  @ApiOkResponse({
    type: CreateImageResposeDto
  })
  @Post()
  @UseGuards(JwtGuard)
  @UseInterceptors(FilesInterceptor('image', 5))
  @ApiConsumes('Multipart/form-data')
  create(@Request() req, @Body() createImageDto: CreateImageDto, @UploadedFiles() files: any) {
    return this.imageService.create(+req.user.userId, createImageDto, files);
  }

  @ApiOkResponse({
    type: GetImagesResponseDto
  })
  @Get(':id')
  @UseGuards(JwtGuard)
  findByCardId(@Request() req, @Param('id') cardId: string) {
    return this.imageService.findByCardId(+req.user.userId, +cardId);
  }

  @ApiOkResponse({
    type: DeleteImageResponseDto
  })
  @Delete()
  @UseGuards(JwtGuard)
  remove(@Request() req, @Body() images: DeleteImageDto) {
    return this.imageService.remove(+req.user.userId, images.iamgeIds);
  }
}
