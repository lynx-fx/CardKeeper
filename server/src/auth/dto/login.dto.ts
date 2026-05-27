import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsString, IsStrongPassword } from "class-validator";

export class LoginUserDto {
    @ApiProperty()
    @IsEmail()
    email!: string;
    
    @ApiProperty()
    @IsString()
    // @IsStrongPassword()
    password!:string;
}

export class LoginUserReponse {
    @ApiProperty()
    success!: boolean;
    @ApiProperty()
    message!: string;
    @ApiProperty()
    token!: string;
}