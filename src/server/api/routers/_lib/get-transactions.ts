import { db } from "~/server/db";
import { DateTime } from "luxon";


export async function getGroupedTransactions(dbeg: Date, dend: Date, limit: number, offset: number, userId: string) {
    const transactions = await db.transaction.findMany({
      include: {
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: limit,
      skip: offset,
      where: {
        userId: userId,
        date: {
          gte: dbeg,
          lt: dend,
        },
      },
    });
  
    const grouped = transactions.reduce((acc, transaction) => {
      const startOfDay = DateTime.fromJSDate(transaction.date).startOf('day').toISO();
      const typeGroup = acc[transaction.type] || {};
  
      if (!typeGroup[startOfDay]) {
        typeGroup[startOfDay] = { start: startOfDay, items: [] };
      }
  
      typeGroup[startOfDay].items.push({
        id: transaction.id,
        date: transaction.date.toISOString(),
        amount: transaction.amount,
        category: transaction.category?.name || 'Неизвестная категория',
        categoryId: transaction.category?.id,
        icon: transaction.category?.icon || 'Unknown',
        color: transaction.category?.color || '#808080',
        commentary: transaction.commentary,
        type: transaction.type,
      });
  
      acc[transaction.type] = typeGroup;
  
      return acc;
    }, {});
  
    return {
      transactions: {
        out: Object.values(grouped.OUT || {}),
        in: Object.values(grouped.IN || {}),
      },
    };
  }
  