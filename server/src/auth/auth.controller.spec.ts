import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let dto: RegisterUserDto;

  const mockUserService = {
    register: jest.fn().mockResolvedValue({
      success: true,
      message: "User registered successfully"
    }),
    login: jest.fn().mockResolvedValue({
      success: true,
    })
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    dto = new RegisterUserDto();
    dto.email = "mail@gmail.com";
    dto.password = "password";
    dto.userName = "exampleUser";

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).overrideProvider(AuthService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {

    expect(await controller.register(dto))
      .toEqual({
        success: true,
        message: "User registered successfully"
      });
    expect(mockUserService.register).toHaveBeenCalledWith(dto);
  });

  it('should throw an error for user already exists', async () => {
    mockUserService.register.mockRejectedValueOnce(new Error("User already exists"));
    await expect(controller.register(dto)).rejects.toThrow("User already exists");
  });
});
