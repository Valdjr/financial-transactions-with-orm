import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(transactions?: Transaction[]): Promise<Balance> {
    transactions = transactions || (await this.find());
    const income = transactions.reduce((acumulator, current) => {
      if (current.type === 'income') {
        return acumulator + current.value;
      }
      return acumulator;
    }, 0);
    const outcome = transactions.reduce((acumulator, current) => {
      if (current.type === 'outcome') {
        return acumulator + current.value;
      }
      return acumulator;
    }, 0);
    const balance = {
      income,
      outcome,
      total: income - outcome,
    };
    return balance;
  }
}

export default TransactionsRepository;
