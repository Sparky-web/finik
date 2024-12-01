import { DateTime } from 'luxon';
import { db } from '~/server/db';

export async function getSummary(dbeg: Date, dend: Date, userId: string) {
  const transactions = await db.transaction.groupBy({
    by: ['type', 'categoryId'],
    _sum: {
      amount: true,
    },
    where: {
      userId: userId,
      date: {
        // Опционально: фильтр по дате, например, за последний месяц
        // gte: DateTime.now().minus({ months: 1 }).startOf('month').toJSDate(),
        // lt: DateTime.now().endOf('day').toJSDate(),
        gte: dbeg,
        lt: dend,
      },
    },
  });

  const categories = await db.category.findMany();

  const summary = transactions.reduce((acc, item) => {
    const category = categories.find((cat) => cat.id === item.categoryId) || {};
    if (!acc[item.type]) acc[item.type] = { total: 0, categories: [] };

    acc[item.type].total += item._sum.amount || 0;
    acc[item.type].categories.push({
      name: category.name || 'Неизвестная категория',
      amount: item._sum.amount || 0,
      color: category.color || '#808080',
    });

    return acc;
  }, {});

  return { summary };
}
