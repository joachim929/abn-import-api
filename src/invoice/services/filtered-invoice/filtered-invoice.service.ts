import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InvoiceRepositoryService } from '../../invoice-repository/invoice-repository.service';
import { InvoiceFilteredDTO } from '../../dtos/invoice-filtered.dto';

@Injectable()
export class FilteredInvoiceService {
  constructor(private repositoryService: InvoiceRepositoryService) {
  }

  get(body: InvoiceFilteredDTO): Promise<InvoiceFilteredDTO> {
    return new Promise(resolve => {
      const promises = [];
      promises.push(this.repositoryService.getMaxAmount());
      promises.push(this.repositoryService.getMinAmount());
      promises.push(this.repositoryService.getFilteredInvoices(body));
      Promise.all(promises).then(result => {
        const res: InvoiceFilteredDTO = {
          minAmount: result[0].min,
          maxAmount: result[1].max,
          records: result[2][0],
          count: result[2][1]
        };
        resolve(res);
      }).catch(reason => {
        throw new HttpException(reason, HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });
  }

}
