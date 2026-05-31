import { Controller, Get, Post, Body, Patch, Request, Param, Delete, UseGuards } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto, CreateCardResponseDto, DeleteCardResponseDto, GetCardResponseDto, GetCardsResponseDto, UpdateCardResponseDto } from './dto/card.dto';
import { UpdateCardDto } from './dto/card.dto';
import { JwtGuard } from '../../guard/jwtVerifyGuard';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @ApiOkResponse({
    type: CreateCardResponseDto
  })
  @Post()
  @UseGuards(JwtGuard)
  create(@Request() req, @Body() createCardDto: CreateCardDto){
    return this.cardService.create(+req.user.user_id, createCardDto);
  }

  @ApiOkResponse({
    type: GetCardsResponseDto
  })
  @Get()
  @UseGuards(JwtGuard)
  findAll(@Request() req) {
    return this.cardService.findAll(+req.user.user_id);
  }

  @ApiOkResponse({
    type: GetCardResponseDto
  })
  @Get(':id')
  @UseGuards(JwtGuard)
  findOne(@Request() req, @Param('id') id: string) {
    return this.cardService.findOne(+req.user.user_id, +id);
  }

  @ApiOkResponse({
    type: UpdateCardResponseDto
  })
  @Patch(':id')
  @UseGuards(JwtGuard)
  update(@Request() req,@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardService.update(+req.user.user_id, +id, updateCardDto);
  }

  @ApiOkResponse({
    type: DeleteCardResponseDto
  })
  @Delete(':id')
  @UseGuards(JwtGuard)
  remove(@Request() req,@Param('id') id: string) {
    return this.cardService.remove(+req.user.user_id, +id);
  }
}
