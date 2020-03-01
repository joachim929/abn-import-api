import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SplitInvoiceDTO } from '../../dtos/split-invoice.dto';
import { InvoiceRepositoryService } from '../../invoice-repository/invoice-repository.service';

@Injectable()
export class SplitInvoiceService {
  constructor(private repositoryService: InvoiceRepositoryService) {
  }

  splitInvoice(invoices: SplitInvoiceDTO): Promise<SplitInvoiceDTO> {
    return new Promise(resolve => {
      this.repositoryService.getInvoice(invoices.patch.id).then((next) => {
        if (this.validateGetInvoice(next) && this.validateAmount(invoices, next[0].amount)) {
          const promises = [];
          promises.push(this.repositoryService.updateInvoice(invoices.patch.id, invoices.patch));
          promises.push(this.repositoryService.createInvoice(invoices.split));
          Promise.all(promises).then((_promises) => {
            if (_promises.length === 2) {
              resolve({ patch: invoices.patch, split: _promises[1] });
            } else {
              throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
          });
        } else {
          throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
        }
      });
    });
  }

  private validateGetInvoice(next): boolean {
    let valid = false;
    if (next.length === 1) {
      valid = true;
    } else if (next.length < 0) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    } else {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return valid;
  }

  private validateAmount(invoices: SplitInvoiceDTO, originalAmount: number): boolean {
    return Number(invoices.patch.amount) + Number(invoices.split.amount) === Number(originalAmount);
  }

}
