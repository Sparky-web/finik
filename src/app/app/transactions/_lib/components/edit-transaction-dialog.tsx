'use client'

import * as React from 'react'
import { useForm } from "@tanstack/react-form"

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMediaQuery } from '@custom-react-hooks/use-media-query'
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { cn } from "~/lib/utils"
import { Transaction } from '@prisma/client'
import { P } from '~/components/ui/typography'
import TransactionForm from '~/app/_lib/components/transaction-form'
import { convertDate } from './add-tranasction'
import { toast } from 'sonner'
import { api } from '~/trpc/react'
import { zodValidator } from '@tanstack/zod-form-adapter'

interface EditTransactionDialogProps {
  transaction: Transaction,
  triggerButton?: React.FC<any>
}

const schema = z.object({
  from: z.string().min(1, 'Выберите счет отправителя'),
  to: z.string().min(1, 'Выберите счет получателя'),
  amount: z.number().min(0.01, 'Сумма должна быть больше 0'),
})

export function EditTransactionDialog({ transaction, triggerButton: CustomTriggerButton }: EditTransactionDialogProps) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = true

  const { mutateAsync: updateTransaction } = api.transaction.update.useMutation()

  const utils = api.useUtils()

  const form = useForm({
    defaultValues: {
      id: transaction.id,
      date: convertDate(transaction.date || new Date().toISOString()),
      amount: transaction.amount,
      categoryId: transaction.categoryId,
      notes: transaction.commentary || '',
      type: transaction.type
    },
    validatorAdapter: zodValidator(),
    onSubmit: async (data) => {
      const values = data.value

      try {
        await updateTransaction({
          id: values.id,
          date: new Date(values.date).toISOString(),
          amount: +values.amount,
          categoryId: values.categoryId,
          notes: values.notes,
        })

        utils.transaction.get.invalidate()
        utils.transaction.get.refetch()
        utils.user.getMonth.invalidate()
        utils.user.getMonth.refetch()
        toast.success('Транзакция успешно изменена')
        setOpen(false)
      } catch (e) {
        console.error(e)
        toast.error('Ошибка изменения транзакции: ' + e.message)
      }
    }
  })


  const triggerButton = CustomTriggerButton ?
    (
      <CustomTriggerButton onClick={() => setOpen(true)} />
    ) :
    (
      <Button onClick={() => setOpen(true)} size={'sm'}>
        редактировать
      </Button>
    )

  const content = (
    <TransactionForm form={form} />
  )


  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-semibold">Редактировать транзакцию</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {/* {transaction} */}
            </DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-2xl font-semibold">Редактировать транзакцию</DrawerTitle>
          {/* <DrawerDescription className="text-gray-600">
            Переведите средства между вашими счетами.
          </DrawerDescription> */}
        </DrawerHeader>
        <div className="p-4 pb-10">
          {content}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

