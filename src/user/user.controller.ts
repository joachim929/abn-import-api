import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserDTO } from './dtos/user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private service: UserService,
  ) {
  }

  @Get()
  @ApiResponse({
    status: 200, description: 'The found records', type: [UserDTO],
  })
  getAll(): Promise<UserDTO[]> {
    return this.service.getUsers();
  }

  @Get(':id')
  @ApiResponse({
    status: 200, description: 'The found record', type: UserDTO,
  })
  get(@Param() params): Promise<UserDTO> {
    return this.service.getUser(params.id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 204, description: 'Record patched'
  })
  patch(@Body() user: User) {
    return this.service.patchUser(user);
  }

  @Delete(':id')
  @ApiResponse({
    status: 204, description: 'Record deleted'
  })
  delete(@Param() params) {
    return this.service.deleteUser(params.id);
  }

  @Post()
  @ApiResponse({
    status: 201, description: 'Created record', type: UserDTO,
  })
  create(@Body() user: User): Promise<UserDTO> {
    return this.service.createUser(user);
  }
}
