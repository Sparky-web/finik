'use client'

import { DateTime } from "luxon"
import * as React from "react"
import { ArrowRightCircle, Pencil, ShoppingBasket, Trash2, TypeIcon as type, LucideIcon, Circle } from 'lucide-react'
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

interface Transaction {
  id: number
  date: string
  amount: number
  category: string
  icon: string
  type: 'in' | 'out'
}

interface DayTransactions {
  start: string
  items: Transaction[]
}

interface Category {
  id: number
  type: 'in' | 'out'
  name: string
  icon: string
  color: string
}

// This would normally be an API call
const mockCategories: Category[] = [
  { id: 1, type: 'out', name: 'Супермаркеты', icon: 'ShoppingBasket', color: '#FF4444' },
  { id: 2, type: 'out', name: 'Переводы', icon: 'ArrowRightCircle', color: '#33AA33' },
  { id: 3, type: 'in', name: 'Зарплата', icon: 'Wallet', color: '#4444FF' },
]

export default function TransactionList({ days = [{ "start": "2024-11-30T00:00:00Z", "items": [{ "id": 1, "date": "2024-11-30T10:15:00Z", "amount": -171.48, "category": "Супермаркеты", "icon": "ShoppingBasket", "type": "out" }, { "id": 2, "date": "2024-11-30T15:30:00Z", "amount": -2000, "category": "Переводы", "icon": "ArrowRightCircle", "type": "out" }] }] }: { days: DayTransactions[] }) {
  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | null>(null)
  const [deletingTransaction, setDeletingTransaction] = React.useState<Transaction | null>(null)

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

  return (
    <div className="space-y-6">

      {days.map((day) => (
        <div key={day.start} className="space-y-4">
          <h2 className="text-lg font-semibold">{formatDate(day.start)}</h2>
          <div className="space-y-2">
            {day.items.map((transaction) => {
              const Icon = icons[transaction.icon]
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    {Icon && <Icon className="w-5 h-5" />}
                    <div>
                      <div className="font-medium flex items-center gap-2 content-center">{transaction.category}
                        <div className="w-4 h-4 rounded-md mt-0.25" style={{ backgroundColor: mockCategories.find(c => c.name === transaction.category)?.color || '#808080' }} />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatTime(transaction.date)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "font-medium",
                      transaction.type === 'in' ? 'text-green-600' : 'text-red-600'
                    )}>
                      {transaction.type === 'in' ? '+' : ''}{transaction.amount.toFixed(2)} ₽
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
            <DialogTitle>Удалить транзакцию</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить эту транзакцию? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingTransaction(null)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeletingTransaction(null)}
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

