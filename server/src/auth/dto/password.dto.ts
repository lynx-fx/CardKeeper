import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString } from "class-validator";

export class changePasswordDto {
    @ApiProperty()
    @IsString()
    old_password!: string;

    @ApiProperty()
    @IsString()
    new_password!: string;
}

export class resetPasswordDto {
    @ApiProperty()
    @IsString()
    new_password!: string;

    @ApiProperty()
    @IsString()
    code!: string;

    @ApiProperty()
    @IsEmail()
    email!: string;
}

export class validateResetTokenDto {
    @ApiProperty()
    @IsString()
    code!: string;

    @ApiProperty()
    @IsEmail()
    email!: string;
}

export class forgotPasswordDto {
    @ApiProperty()
    @IsEmail()
    email!: string;
}

export class changePasswordResponse {
    success!: boolean;
    message!: string;
}

export class resetPasswordResponse {
    success!: boolean;
    message!: string;
}

export class forgotPasswordResponse {
    success!: boolean;
    message!: string;
}

export class validateResetTokenResponse {
    success!: boolean;
}