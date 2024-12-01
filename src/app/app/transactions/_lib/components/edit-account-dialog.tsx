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
import { cn } from "~/lib/utils"
import { api } from '~/trpc/react'
import { toast } from 'sonner'
import { Loader } from 'lucide-react'

interface AccountModificationProps {
    type: "default" | "savings"
    currentBalance: number
    onSave: (newBalance: number) => void,
    triggerButton?: React.FC<any>,
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

const schema = z.object({
    balance: z.number().min(0, 'Баланс должен быть положительным числом'),
})

export function AccountModificationDialog({ type, currentBalance, onSave, triggerButton: CustomTriggerButton, open: customOpen, onOpenChange: customOnOpenChange }: AccountModificationProps) {
    const [open, setOpen] = React.useState(customOpen || false)

    const isDesktop = true

    const { mutateAsync, isPending } = api.user.setMoney.useMutation()
    const utils = api.useUtils()

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            balance: currentBalance,
        },
    })

    const onSubmit = async (data: z.infer<typeof schema>) => {
        try {
            await mutateAsync({
                money: data.balance
            })
            utils.user.getMonth.invalidate()
            utils.user.getMonth.refetch()
            toast.success('Баланс изменен')
            setOpen(false)
        } catch (e) {
            console.error(e)
            toast.error('Ошибка изменения баланса: ' + e.message)
        }
    }

    React.useEffect(() => {
        if (customOnOpenChange) customOnOpenChange(open)
    }, [open])

    React.useEffect(() => {
        if (customOpen) setOpen(customOpen)
    }, [customOpen])

    const accountTypeLabel = type === "default" ? "Основной счет" : "Накопительный счет"

    const triggerButton = CustomTriggerButton ?
        (
            <CustomTriggerButton onClick={() => setOpen(true)} />
        ) :
        (
            <Button onClick={() => setOpen(true)} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transform transition duration-300 hover:scale-105">
                Изменить {accountTypeLabel}
            </Button>
        )

    const content = (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1">
                <Label htmlFor="balance" className="">
                    Новый баланс
                </Label>
                <Controller
                    name="balance"
                    control={control}
                    render={({ field }) => (
                        <div className="relative">
                            <Input

                                id="balance"
                                type="number"
                                step="0.01"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                className="pl-8 pr-4 py-3 !ring-0 border-2 border-purple-300 focus:border-pink-500 rounded-lg shadow-sm text-lg"
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                ₽
                            </span>
                        </div>
                    )}
                />
                {errors.balance && <p className="text-sm text-red-500">{errors.balance.message}</p>}
            </div>
            <Button
                disabled={isPending}
                type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white  py-3 rounded-lg shadow-lg transform transition duration-300 hover:scale-101">
                {isPending && <Loader className="w-4 h-4 animate-spin" />}
                Сохранить
            </Button>
        </form>
    )

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                {!customOnOpenChange && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="mb-2">{accountTypeLabel}</DialogTitle>
                        <DialogDescription className="text-muted-foreground mt-3">
                            Измените баланс вашего {type === "default" ? "основного" : "накопительного"} счета.
                        </DialogDescription>
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
                    <DrawerTitle className="text-2xl font-bold">{accountTypeLabel}</DrawerTitle>
                    <DrawerDescription className="text-muted-foreground">
                        Измените баланс вашего {type === "default" ? "основного" : "накопительного"} счета.
                    </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 pb-10">
                    {content}
                </div>
            </DrawerContent>
        </Drawer>
    )
}

