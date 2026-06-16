import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';
import { S3Service } from '../s3/s3.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user-service/user-service.service';

describe('CardService', () => {
  let service: CardService;

  const mockPrismaService = {
    $transaction: jest.fn(),
    card: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
    image: {
      deleteMany: jest.fn(),
    }
  };

  const mockUserService = {
    findExistingUser: jest.fn(),
  };

  const mockS3Service = {
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardService,
        { provide: S3Service, useValue: mockS3Service },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<CardService>(CardService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a card and return the created card response', async () => {
      const userId = 1;
      const existingUser = { userId };
      const createCardDto = {
        productName: 'Phone',
        brand: 'Example',
        category: 'Electronics',
        purchaseDate: '2025-01-01T00:00:00.000Z',
        warrantyExpiry: '2026-01-01T00:00:00.000Z',
        purchasePrice: 699,
        store: 'Store A',
        serialNumber: 'SN123456',
        warrantyType: 'MANUFACTURER',
        description: 'Test device',
      };
      const files = [{ originalname: 'test.jpg', buffer: Buffer.from('abc') }];
      const createdCard = {
        cardId: 123,
        ...createCardDto,
        userId,
        isActive: true,
        imageUri: `cards/${userId}/123-test.jpg`,
        purchaseDate: new Date('2025-01-01T00:00:00.000Z'),
        warrantyExpiry: new Date('2026-01-01T00:00:00.000Z'),
      };

      jest.spyOn(Date, 'now').mockReturnValue(123);
      mockUserService.findExistingUser.mockResolvedValue(existingUser);

      const createSpy = jest.fn().mockResolvedValue(createdCard);
      const createManySpy = jest.fn().mockResolvedValue({ count: 1 });

      mockPrismaService.$transaction.mockImplementation(async (transactionFn: any) => {
        return transactionFn({
          card: { create: createSpy },
          image: { createMany: createManySpy },
        });
      });

      const result = await service.create(userId, createCardDto as any, files as any);

      expect(mockUserService.findExistingUser).toHaveBeenCalledWith(userId);
      expect(mockS3Service.uploadFile).toHaveBeenCalledWith(files[0], `cards/${userId}/123-test.jpg`);
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ...createCardDto,
          userId,
          isActive: true,
          imageUri: `cards/${userId}/123-test.jpg`,
        }),
      });
      expect(createManySpy).toHaveBeenCalledWith({
        data: [{ cardId: createdCard.cardId, imageUri: `cards/${userId}/123-test.jpg` }],
      });

      expect(result).toEqual({
        success: true,
        message: 'Card created',
        card: {
          ...createdCard,
          purchaseDate: '2025-01-01T00:00:00.000Z',
          warrantyExpiry: '2026-01-01T00:00:00.000Z',
        },
      });
    });

    it('should throw BadRequestException when no files are provided', async () => {
      mockUserService.findExistingUser.mockResolvedValue({ userId: 1 });

      await expect(service.create(1, {} as any, [])).rejects.toThrow(BadRequestException);
      await expect(service.create(1, {} as any, undefined)).rejects.toThrow('At least one image must be provided');
    });
  });

  describe('findAll', () => {
    it('should return all cards for the user', async () => {
      const userId = 1;
      const existingUser = { userId };
      const cards = [
        {
          cardId: 1,
          productName: 'Phone',
          brand: 'Example',
          category: 'Electronics',
          purchaseDate: new Date('2025-01-01T00:00:00.000Z'),
          warrantyExpiry: new Date('2026-01-01T00:00:00.000Z'),
          purchasePrice: 699,
          store: 'Store A',
          serialNumber: 'SN123456',
          warrantyType: 'MANUFACTURER',
          description: 'Test device',
          imageUri: 'cards/1/123-test.jpg',
        },
      ];

      mockUserService.findExistingUser.mockResolvedValue(existingUser);
      mockPrismaService.card.findMany.mockResolvedValue(cards);

      const result = await service.findAll(userId);

      expect(mockUserService.findExistingUser).toHaveBeenCalledWith(userId);
      expect(mockPrismaService.card.findMany).toHaveBeenCalledWith({ where: { userId } });
      expect(result).toEqual({
        success: true,
        cards: [
          {
            ...cards[0],
            purchaseDate: '2025-01-01T00:00:00.000Z',
            warrantyExpiry: '2026-01-01T00:00:00.000Z',
          },
        ],
      });
    });

    it('should throw NotFoundException when no cards exist', async () => {
      const userId = 1;
      mockUserService.findExistingUser.mockResolvedValue({ userId });
      mockPrismaService.card.findMany.mockResolvedValue([]);

      await expect(service.findAll(userId)).rejects.toThrow('No cards available');
    });
  });

  describe('findOne', () => {
    it('should return a single card with images', async () => {
      const userId = 1;
      const cardId = 101;
      const existingUser = { userId };
      const card = {
        cardId,
        productName: 'Phone',
        brand: 'Example',
        category: 'Electronics',
        purchaseDate: new Date('2025-01-01T00:00:00.000Z'),
        warrantyExpiry: new Date('2026-01-01T00:00:00.000Z'),
        purchasePrice: 699,
        store: 'Store A',
        serialNumber: 'SN123456',
        warrantyType: 'MANUFACTURER',
        description: 'Test device',
        imageUri: 'cards/1/123-test.jpg',
        images: [{ imageUri: 'cards/1/123-test.jpg' }],
      };

      mockUserService.findExistingUser.mockResolvedValue(existingUser);
      mockPrismaService.card.findUnique.mockResolvedValue(card);

      const result = await service.findOne(userId, cardId);

      expect(mockUserService.findExistingUser).toHaveBeenCalledWith(userId);
      expect(mockPrismaService.card.findUnique).toHaveBeenCalledWith({ where: { cardId }, include: { images: true } });
      expect(result).toEqual({
        success: true,
        card: {
          ...card,
          purchaseDate: '2025-01-01T00:00:00.000Z',
          warrantyExpiry: '2026-01-01T00:00:00.000Z',
        },
      });
    });

    it('should throw NotFoundException when the card does not exist', async () => {
      const userId = 1;
      const cardId = 101;

      mockUserService.findExistingUser.mockResolvedValue({ userId });
      mockPrismaService.card.findUnique.mockResolvedValue(null);

      await expect(service.findOne(userId, cardId)).rejects.toThrow('Card details not fonud');
    });
  });

  describe('update', () => {
    it('should update the card and return success message', async () => {
      const userId = 1;
      const cardId = 101;
      const updateCardDto = { productName: 'Updated Phone' };

      mockUserService.findExistingUser.mockResolvedValue({ userId });
      mockPrismaService.card.update.mockResolvedValue({});

      const result = await service.update(userId, cardId, updateCardDto as any);

      expect(mockUserService.findExistingUser).toHaveBeenCalledWith(userId);
      expect(mockPrismaService.card.update).toHaveBeenCalledWith({
        where: { cardId, userId },
        data: updateCardDto,
      });
      expect(result).toEqual({ success: true, message: 'Updated Phone udpated successfully' });
    });
  });

  describe('remove', () => {
    it('should delete card and its images', async () => {
      const userId = 1;
      const cardId = 101;
      const existingUser = { userId };
      const card = {
        cardId,
        images: [{ imageUri: 'cards/1/101-test.jpg' }],
      };

      mockUserService.findExistingUser.mockResolvedValue(existingUser);
      mockPrismaService.card.findFirst.mockResolvedValue(card);
      mockPrismaService.image.deleteMany.mockResolvedValue({ count: 1 });
      mockPrismaService.card.delete.mockResolvedValue({});
      mockPrismaService.$transaction.mockResolvedValue([{}, {}]);

      const result = await service.remove(userId, cardId);

      expect(mockUserService.findExistingUser).toHaveBeenCalledWith(userId);
      expect(mockPrismaService.card.findFirst).toHaveBeenCalledWith({ where: { cardId, userId }, include: { images: true } });
      expect(mockPrismaService.$transaction).toHaveBeenCalledWith([
        expect.any(Object),
        expect.any(Object),
      ]);
      expect(mockS3Service.deleteFile).toHaveBeenCalledWith('cards/1/101-test.jpg');
      expect(result).toEqual({ success: true, message: 'Card successfully deleted' });
    });

    it('should throw NotFoundException when trying to delete missing card', async () => {
      const userId = 1;
      const cardId = 101;

      mockUserService.findExistingUser.mockResolvedValue({ userId });
      mockPrismaService.card.findFirst.mockResolvedValue(null);

      await expect(service.remove(userId, cardId)).rejects.toThrow('Card not found');
    });
  });
});
