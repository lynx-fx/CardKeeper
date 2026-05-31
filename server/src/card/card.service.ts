import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CardDto, CreateCardDto, CreateCardResponseDto, GetCardResponseDto, GetCardsResponseDto, UpdateCardDto } from './dto/card.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AUTH_RESPONSE } from '../auth/constants/auth-messages';
import { User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';


@Injectable()
export class CardService {

  constructor(private readonly prisma: PrismaService) { }

  async create(user: number, createCardDto: CreateCardDto): Promise<CreateCardResponseDto> {
    const existingUser: User = await this.findExistingUser(user);

    await this.prisma.card.create({
      data: {
        ...createCardDto,
        user_id: user,
        isActive: true,
      }
    })
    return { success: true, message: "Card created" };
  }

  async findAll(user: number): Promise<GetCardsResponseDto> {
    const existingUser: User = await this.findExistingUser(user);

    const cards = await this.prisma.card.findMany({ where: { user_id: existingUser.user_id } })

    if (cards.length === 0) {
      throw new NotFoundException({ success: false, message: "No cards available" })
    }

    const cardsDto = plainToInstance(CardDto, cards);

    return { success: true, cards: cardsDto }
  }

  async findOne(user: number, card_id: number): Promise<GetCardResponseDto> {
    const exisingUser: User = await this.findExistingUser(user);

    const card = await this.prisma.card.findUnique({ where: { card_id } });

    if (!card) {
      throw new NotFoundException({ success: false, message: "Card details not fonud" })
    }

    const cardDto = plainToInstance(CardDto, card);

    return { success: true, card: cardDto }
  }

  async update(user: number, card_id: number, updateCardDto: UpdateCardDto) {
    const existingUser: User = await this.findExistingUser(user);

    await this.prisma.card.update({
      where: { card_id },
      data: {
        ...updateCardDto
      }
    })

    return { success: true, message: `${updateCardDto.productName} udpated successfully` }
  }

  async remove(user: number, card_id: number) {
    const exisitngUser: User = await this.findExistingUser(user);

    const card = await this.prisma.card.findFirst({ where: { card_id, user_id: exisitngUser.user_id } });
    if (!card) throw new NotFoundException({ success: false, message: "Card not found" });

    // delete the images first and then card
    await this.prisma.$transaction([
      this.prisma.image.deleteMany({
        where: { card_id }
      }),
      this.prisma.card.delete({
        where: { card_id }
      })
    ])

    return { success: true, message: "Card successfully deleted" };
  }


  private async findExistingUser(user_id?: number, email?: string): Promise<User> {
    const user = user_id
      ? await this.prisma.user.findUnique({ where: { user_id } })
      : email
        ? await this.prisma.user.findUnique({ where: { email } })
        : null;

    if (!user) throw new NotFoundException({
      success: false,
      message: AUTH_RESPONSE.USER_NOT_FOUND
    });

    return user;
  }

}

