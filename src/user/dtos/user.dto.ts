import { CategoryGroupDTO } from '../../category-group/dtos/category-group.dto';
import { InvoiceDTO } from '../../invoice/dtos/invoice.dto';
import { User } from '../user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  categoryGroups?: CategoryGroupDTO[];

  @ApiProperty()
  invoices?: InvoiceDTO[];

  constructor(user: User) {
    this.id = user.id;
    this.userName = user.userName;
    this.email = user.email;
    if (user.categoryGroups) {
      this.categoryGroups = user.categoryGroups;
    }
    if (user.invoices) {
      this.invoices = user.invoices;
    }
  }
}
