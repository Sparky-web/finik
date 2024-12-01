'use client'

import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
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

interface TransferDialogProps {
  onTransfer: (from: string, to: string, amount: number) => void,
  open?: boolean
  onOpenChange?: (open: boolean) => void
  triggerButton?: React.FC<any>
}

const schema = z.object({
  from: z.string().min(1, 'Выберите счет отправителя'),
  to: z.string().min(1, 'Выберите счет получателя'),
  amount: z.number().min(0.01, 'Сумма должна быть больше 0'),
})

export function TransferDialog({ onTransfer, open: customOpen, onOpenChange: customOnOpenChange, triggerButton: CustomTriggerButton }: TransferDialogProps) {
  const [open, setOpen] = React.useState(customOpen || false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      from: '',
      to: '',
      amount: 0,
    },
  })

  React.useEffect(() => {
    if (customOnOpenChange) customOnOpenChange(open)
  }, [open])

  React.useEffect(() => {
    if (customOpen) setOpen(customOpen)
  }, [customOpen])

  const watchFrom = watch('from')
  const watchTo = watch('to')

  React.useEffect(() => {
    if (watchFrom === watchTo) {
      setValue('to', '')
    }
  }, [watchFrom, watchTo, setValue])

  const onSubmit = (data: z.infer<typeof schema>) => {
    onTransfer(data.from, data.to, data.amount)
    setOpen(false)
  }

  const triggerButton = CustomTriggerButton ?
    (
      <CustomTriggerButton onClick={() => setOpen(true)} />
    ) :
    (
      <Button onClick={() => setOpen(true)} className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transform transition duration-300 hover:scale-105">
        Перевести между счетами
      </Button>
    )

  const content = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-1">
        <Label htmlFor="from" className="">
          Счет откуда перевести
        </Label>
        <Controller
          name="from"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите счет" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Основной счет</SelectItem>
                <SelectItem value="savings">Накопительный счет</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.from && <p className="text-sm text-red-500">{errors.from.message}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="to" className="">
          Счет куда перевести
        </Label>
        <Controller
          name="to"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите счет" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default" disabled={watchFrom === 'default'}>Основной счет</SelectItem>
                <SelectItem value="savings" disabled={watchFrom === 'savings'}>Накопительный счет</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.to && <p className="text-sm text-red-500">{errors.to.message}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="amount" className="">
          Сумма перевода
        </Label>
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                className="pl-8 !ring-0 pr-4 py-3 border-2 border-green-300 focus:border-blue-500 rounded-lg shadow-sm text-lg"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                ₽
              </span>
            </div>
          )}
        />
        {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
      </div>
      <Button type="submit" className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white py-3 rounded-lg shadow-lg transform transition duration-300 hover:scale-101">
        Выполнить перевод
      </Button>
    </form>
  )

  console.log(open)

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {!customOnOpenChange && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className=" ">Перевод между счетами</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {!customOnOpenChange && <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>}
      <DrawerContent>
        <DrawerHeader className="text-center">
          <DrawerTitle className="">Перевод между счетами</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pb-10">
          {content}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

