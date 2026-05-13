import { IsEmail, IsString } from "class-validator";
import { LoginUserDto } from "./login.dto";

export class RegisterUserDto extends LoginUserDto{
    @IsString()
    userName!: string;

}
