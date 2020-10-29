import fs from 'fs';
import parse from 'csv-parse';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(path: string): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();
    const transactions: Transaction[] = [];
    const readCSVStream = fs.createReadStream(path);
    const parseStream = parse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });
    const parseCSV = readCSVStream.pipe(parseStream);
    parseCSV.on('data', async line => {
      const transaction = await createTransaction.execute({
        title: line[0][0],
        type: line[0][1],
        value: line[0][2],
        category: line[0][3],
      });
      transactions.push(transaction);
    });
    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    return transactions;
  }
}

export default ImportTransactionsService;
