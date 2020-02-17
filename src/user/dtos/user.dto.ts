import { CategoryGroupDTO } from '../../category-group/dtos/category-group.dto';
import { InvoiceDTO } from '../../invoice/dtos/invoice.dto';
import { User } from '../user.entity';

export class UserDTO {
  id: number;
  userName: string;
  email: string;
  categoryGroups?: CategoryGroupDTO[];
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
