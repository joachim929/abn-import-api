import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('/api/user')
export class UserController {
  constructor(
    private service: UserService,
  ) {
  }

  @Get()
  getAll() {
    return this.service.getUsers();
  }

  @Get(':id')
  get(@Param() params) {
    return this.service.getUser(params.id);
  }

  @Patch(':id')
  patch(@Body() user: User) {
    return this.service.patchUser(user);
  }

  @Delete(':id')
  delete(@Param() params) {
    return this.service.deleteUser(params.id);
  }

  @Post()
  create(@Body() user: User) {
    return this.service.createUser(user);
  }
}
