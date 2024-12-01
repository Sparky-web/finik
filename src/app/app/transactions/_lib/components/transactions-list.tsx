'use client'

import { DateTime } from "luxon"
import * as React from "react"
import { ArrowRightCircle, Pencil, ShoppingBasket, Trash2, TypeIcon as type, LucideIcon, Circle, Loader } from 'lucide-react'
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { EditTransactionDialog } from './edit-transaction-dialog'
import TransactionForm from "~/app/_lib/components/transaction-form"
import { cn } from "~/lib/utils"
import { Check } from 'lucide-react'
import { useForm } from "@tanstack/react-form"
import { P } from "~/components/ui/typography"
import { api } from "~/trpc/react"
import { toast } from "sonner"
import { formatAmount } from "./categories"

interface Transaction {
  id: string
  date: string
  amount: number
  category: string
  icon: string
  type: 'IN' | 'OUT'
}

interface DayTransactions {
  start: string
  items: Transaction[]
}

interface Category {
  id: number
  type: 'IN' | 'OUT'
  name: string
  icon: string
  color: string
}


export default function TransactionList({ days, selectedCategories }: { days: DayTransactions[] }) {
  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | null>(null)
  const [deletingTransaction, setDeletingTransaction] = React.useState<Transaction | null>(null)

  const utils = api.useUtils()

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
  }

  const handleDelete = (transaction: Transaction) => {
    setDeletingTransaction(transaction)
  }

  const formatDate = (date: string) => {
    return DateTime.fromISO(date).setLocale('ru').toFormat("d MMMM yyyy 'г.'")
  }

  const formatTime = (date: string) => {
    return DateTime.fromISO(date).toFormat("HH:mm")
  }

  const icons: Record<string, LucideIcon> = {
    ShoppingBasket,
    ArrowRightCircle,
  }

  const { mutateAsync: deleteTransaction, isPending } = api.transaction.delete.useMutation()

  return (
    <div className="space-y-6">

      {days
        .filter(e => selectedCategories.length === 0 || selectedCategories.some(c => e.items.find(i => i.category === c)))
        .map((day) => (
          <div key={day.start} className="space-y-4">
            <h2 className="text-lg font-semibold">{formatDate(day.start)}</h2>
            <div className="space-y-2">
              {day.items.filter(e => selectedCategories.length === 0 || selectedCategories.some(c => e.category === c)).map((transaction) => {
                const Icon = icons[transaction.icon]
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      {Icon && <Icon className="w-5 h-5" />}
                      <div>
                        <div className="font-medium flex items-center gap-2 content-center">{transaction.category}
                          <div className="w-4 h-4 rounded-md mt-0.25" style={{ backgroundColor: transaction.color }} />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatTime(transaction.date)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={cn(
                        "font-medium",
                        transaction.type === 'IN' ? 'text-green-600' : 'text-red-600'
                      )}>
                        {transaction.type === 'IN' ? '+' : ''}{formatAmount(transaction.amount)} ₽
                      </span>
                      <div className="flex gap-2">
                        <EditTransactionDialog
                          transaction={transaction}
                          triggerButton={(props) => <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                            {...props}
                          // onClick={() => handleEdit(transaction)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8"
                          onClick={() => handleDelete(transaction)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}


      <Dialog open={!!deletingTransaction} onOpenChange={() => setDeletingTransaction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-3">Удалить транзакцию</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить эту транзакцию? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingTransaction(null)}>
              Отмена
            </Button>
            <Button
              disabled={isPending}
              variant="destructive"
              onClick={async () => {
                try {
                  if (!deletingTransaction) return
                  await deleteTransaction({
                    id: deletingTransaction?.id
                  })
                  toast.success('Транзакция успешно удалена')
                  utils.transaction.get.invalidate()
                  utils.transaction.get.refetch()
                  setDeletingTransaction(null)
                } catch (e) {
                  console.error(e)
                  toast.error('Ошибка удаления транзакции: ' + e.message)
                }
              }}
            >
              {isPending && <Loader className="w-4 h-4 animate-spin" />}
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

