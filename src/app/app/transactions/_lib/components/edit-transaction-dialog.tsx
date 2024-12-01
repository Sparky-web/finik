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

interface EditTransactionDialogProps {
  transaction: Transaction & { category: string, notes: string },
  triggerButton?: React.FC<any>
}

const schema = z.object({
  from: z.string().min(1, 'Выберите счет отправителя'),
  to: z.string().min(1, 'Выберите счет получателя'),
  amount: z.number().min(0.01, 'Сумма должна быть больше 0'),
})

export function EditTransactionDialog({ transaction, triggerButton: CustomTriggerButton }: EditTransactionDialogProps) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const form = useForm({
    defaultValues: {
      ...transaction
    },
    onSubmit: (data) => {
      console.log(data)
      setOpen(false)
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

