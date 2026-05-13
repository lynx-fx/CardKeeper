import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private readonly userService : UserService){

    }

    @Get()
    async findAll(){
        return this.userService.findAllUsers();
    }

    @Get(":id")
    async findById(@Param("id", ParseIntPipe) id: number){
        return this.userService.findUserById(id);
    }
}
