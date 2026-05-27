import { IsEmail, IsString } from "class-validator";
import { LoginUserDto } from "./login.dto";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserDto extends LoginUserDto {
    @ApiProperty()
    @IsString()
    userName!: string;
}

export class RegisterUserResponse {
    @ApiProperty()
    success!: boolean;
    @ApiProperty()
    message!: string;
}