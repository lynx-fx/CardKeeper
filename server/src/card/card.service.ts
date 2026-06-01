import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CardDto, CreateCardDto, CreateCardResponseDto, GetCardResponseDto, GetCardsResponseDto, UpdateCardDto } from './dto/card.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AUTH_RESPONSE } from '../auth/constants/auth-messages';
import { User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { UserService } from '../user-service/user-service.service';


@Injectable()
export class CardService {

  constructor(private readonly prisma: PrismaService, private readonly userService: UserService) { }

  async create(user: number, createCardDto: CreateCardDto): Promise<CreateCardResponseDto> {
    const existingUser: User = await this.userService.findExistingUser(user);

    await this.prisma.card.create({
      data: {
        ...createCardDto,
        userId: user,
        isActive: true,
      }
    })
    return { success: true, message: "Card created" };
  }

  async findAll(user: number): Promise<GetCardsResponseDto> {
    const existingUser: User = await this.userService.findExistingUser(user);

    const cards = await this.prisma.card.findMany({ where: { userId: existingUser.userId } })

    if (cards.length === 0) {
      throw new NotFoundException({ success: false, message: "No cards available" })
    }

    const cardsDto = plainToInstance(CardDto, cards);

    return { success: true, cards: cardsDto }
  }

  async findOne(user: number, cardId: number): Promise<GetCardResponseDto> {
    const existingUser: User = await this.userService.findExistingUser(user);

    const card = await this.prisma.card.findUnique({ where: { cardId } });

    if (!card) {
      throw new NotFoundException({ success: false, message: "Card details not fonud" })
    }

    const cardDto = plainToInstance(CardDto, card);

    return { success: true, card: cardDto }
  }

  async update(user: number, cardId: number, updateCardDto: UpdateCardDto) {
    const existingUser: User = await this.userService.findExistingUser(user);

    await this.prisma.card.update({
      where: { cardId },
      data: {
        ...updateCardDto
      }
    })

    return { success: true, message: `${updateCardDto.productName} udpated successfully` }
  }

  async remove(user: number, cardId: number) {
    const existingUser: User = await this.userService.findExistingUser(user);

    const card = await this.prisma.card.findFirst({ where: { cardId, userId: existingUser.userId } });
    if (!card) throw new NotFoundException({ success: false, message: "Card not found" });

    // delete the images first and then card
    await this.prisma.$transaction([
      this.prisma.image.deleteMany({
        where: { cardId }
      }),
      this.prisma.card.delete({
        where: { cardId }
      })
    ])

    return { success: true, message: "Card successfully deleted" };
  }
}

