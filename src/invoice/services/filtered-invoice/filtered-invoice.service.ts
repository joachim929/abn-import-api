import { Injectable } from '@nestjs/common';
import { InvoiceRepositoryService } from '../../invoice-repository/invoice-repository.service';
import { InvoiceFilteredDTO } from '../../dtos/invoice-filtered.dto';

@Injectable()
export class FilteredInvoiceService {
  constructor(private repositoryService: InvoiceRepositoryService) {
  }

  get(body: InvoiceFilteredDTO) {
    return new Promise(resolve => {
      const promises = [];
      promises.push(this.repositoryService.getMaxAmount());
      promises.push(this.repositoryService.getMinAmount());
      promises.push(this.repositoryService.getFilteredInvoices(body));
      Promise.all(promises).then(result => {
        const res = {
          min: result[0],
          max: result[1],
          results: result[2]
        };
        resolve();
      });
    });
  }

}
