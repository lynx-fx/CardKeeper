import { Injectable, NotFoundException } from '@nestjs/common';
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
    if (!existingUser) this.userNotFound();

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
    const existingUser : User = await this.findExistingUser(user);

    const cards = await this.prisma.card.findMany({where: {user_id: existingUser.user_id}})

    if (cards.length === 0){
      throw new NotFoundException({success: false, message: "No cards available"})
    }

    const cardsDto = plainToInstance(CardDto, cards);

    return {success: true, cards: cardsDto}
  }

  async findOne(user: number, id: number) {
    return { success: true, message: "" };
  }

  async update(user: number, id: number, updateCardDto: UpdateCardDto) {
    return { success: true, message: "" };
  }

  async remove(user: number, id: number) {
    return { success: true, message: "" };
  }

  private userNotFound(): never {
    throw new NotFoundException({
      success: false,
      message: AUTH_RESPONSE.USER_NOT_FOUND
    })
  }

  private async findExistingUser(user_id?: number, email?: string): Promise<User> {
    const user = user_id
    ? await this.prisma.user.findUnique({ where: { user_id } })
    : email
    ? await this.prisma.user.findUnique({ where: { email } })
    : null;

    if (!user) this.userNotFound();
    return user;
  }

}

