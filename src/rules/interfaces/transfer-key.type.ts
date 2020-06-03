import { TransferKeyEnum } from './transfer-key.enum';

export type TransferKeyType =
  TransferKeyEnum.amount |
  TransferKeyEnum.description |
  TransferKeyEnum.transactionDate |
  TransferKeyEnum.currencyCode |
  TransferKeyEnum.accountNumber |
  TransferKeyEnum.startBalance |
  TransferKeyEnum.endBalance
