import { TransferKeyEnum } from './transfer-key.enum';

export type TransferKeyType =
  TransferKeyEnum.Amount |
  TransferKeyEnum.Description |
  TransferKeyEnum.TransactionDate |
  TransferKeyEnum.CurrencyCode |
  TransferKeyEnum.AccountNumber |
  TransferKeyEnum.StartBalance |
  TransferKeyEnum.EndBalance
