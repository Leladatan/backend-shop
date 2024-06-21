import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { ItemsPayloadDto } from '@/utils/items.dto';
import { User } from '@prisma/client';
import { Public } from '@/utils/decorators/public.decorator';
import { UsersPayloadDto } from '@/users/dto/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get()
  async getUsers(
    @Query() query: { username: string },
  ): Promise<ItemsPayloadDto<User>> {
    return this.usersService.getUsers(query.username);
  }

  @Public()
  @Get(':id')
  async getUserId(@Param('id') userId: string): Promise<User> {
    return this.usersService.getUserId(Number(userId));
  }

  @Public()
  @Patch(':id')
  async updateUserId(
    @Param('id') userId: string,
    @Body() payload: UsersPayloadDto,
  ): Promise<User> {
    return this.usersService.updateUserId({ userId: Number(userId), payload });
  }
}
