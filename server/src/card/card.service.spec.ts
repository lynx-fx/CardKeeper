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

  describe('should create a new card', () => {
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
});
