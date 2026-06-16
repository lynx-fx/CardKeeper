import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString } from "class-validator";

export class ChangePasswordDto {
    @ApiProperty()
    @IsString()
    old_password!: string;

    @ApiProperty()
    @IsString()
    new_password!: string;
}

export class ResetPasswordDto {
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

export class ValidateResetTokenDto {
    @ApiProperty()
    @IsString()
    code!: string;

    @ApiProperty()
    @IsEmail()
    email!: string;
}

export class ForgotPasswordDto {
    @ApiProperty()
    @IsEmail()
    email!: string;
}

export class ChangePasswordResponse {
    success!: boolean;
    message!: string;
}

export class ResetPasswordResponse {
    success!: boolean;
    message!: string;
}

export class ForgotPasswordResponse {
    success!: boolean;
    message!: string;
}

export class ValidateResetTokenResponse {
    success!: boolean;
}