// import AppError from '../errors/AppError';

import { getRepository, getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoriesRepository = getRepository(Category);
    let categoryFound = await categoriesRepository.findOne({
      where: { title: category },
    });
    if (!categoryFound) {
      categoryFound = categoriesRepository.create({
        title: category,
      });
      await categoriesRepository.save(categoryFound);
    }
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const balance = await transactionsRepository.getBalance();
    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Insufficiente funds', 400);
    }
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryFound.id,
    });
    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
