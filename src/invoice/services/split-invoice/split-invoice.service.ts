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
        if (this.validateAmount(invoices, next.amount)) {
          invoices.split.originalId = invoices.patch.id;
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
          throw new HttpException(`${invoices.patch.amount} + ${invoices.split.amount} !== original amount: ${next.amount}`, HttpStatus.BAD_REQUEST);
        }
      }).catch(reason => {
        throw new HttpException(reason, HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });
  }

  private validateAmount(invoices: SplitInvoiceDTO, originalAmount: number): boolean {
    invoices.patch.amount = Number(invoices.patch.amount);
    invoices.split.amount = Number(invoices.split.amount);
    return (invoices.patch.amount + invoices.split.amount).toFixed(2) === Number(originalAmount).toFixed(2);
  }

}
