import { Controller, Get, Post, Body, Patch, Request, Param, Delete, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto, CreateCardResponseDto, DeleteCardResponseDto, GetCardResponseDto, GetCardsResponseDto, UpdateCardResponseDto } from './dto/card.dto';
import { UpdateCardDto } from './dto/card.dto';
import { JwtGuard } from '../../guard/jwtVerifyGuard';
import { ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @ApiOkResponse({
    type: CreateCardResponseDto
  })
  @Post()
  @UseGuards(JwtGuard)
  @UseInterceptors(FilesInterceptor('image', 5))
  @ApiConsumes('multipart/form-data')
  create(
    @Request() req,
    @Body() createCardDto: CreateCardDto,
    @UploadedFiles() files : any
  ){
    return this.cardService.create(+req.user.userId, createCardDto, files);
  }

  @ApiOkResponse({
    type: GetCardsResponseDto
  })
  @Get()
  @UseGuards(JwtGuard)
  findAll(@Request() req) {
    return this.cardService.findAll(+req.user.userId);
  }

  @ApiOkResponse({
    type: GetCardResponseDto
  })
  @Get(':id')
  @UseGuards(JwtGuard)
  findOne(@Request() req, @Param('id') id: string) {
    return this.cardService.findOne(+req.user.userId, +id);
  }

  @ApiOkResponse({
    type: UpdateCardResponseDto
  })
  @Patch(':id')
  @UseGuards(JwtGuard)
  update(@Request() req,@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardService.update(+req.user.userId, +id, updateCardDto);
  }

  @ApiOkResponse({
    type: DeleteCardResponseDto
  })
  @Delete(':id')
  @UseGuards(JwtGuard)
  remove(@Request() req,@Param('id') id: string) {
    return this.cardService.remove(+req.user.userId, +id);
  }
}
