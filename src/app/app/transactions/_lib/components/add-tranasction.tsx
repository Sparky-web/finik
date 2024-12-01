
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
import { api } from '~/trpc/react'
import { toast } from 'sonner'
import { useAppSelector } from '~/app/_lib/client-store'

interface AddTransactionDialogProps {
    customOpen?: boolean
    onOpenChange?: (open: boolean) => void
    triggerButton?: React.FC<any>,
    type: 'IN' | 'OUT'
}

export const convertDate = (isoString: string) => {
    const date = new Date(isoString);

    // Get components of the date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Combine into `datetime-local` format
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    return formattedDate;
}

export function AddTransactionDialog({ triggerButton: CustomTriggerButton, customOpen, onOpenChange, type }: AddTransactionDialogProps) {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    const { mutateAsync: addTransaction, isPending } = api.transaction.create.useMutation()

    React.useEffect(() => {
        if (customOpen) setOpen(customOpen)
    }, [customOpen])

    React.useEffect(() => {
        if (onOpenChange) onOpenChange(open)
    }, [open])

    const user = useAppSelector(e => e.user?.user)

    const utils = api.useUtils()

    const form = useForm({
        defaultValues: {
            type: type,
            date: convertDate(new Date().toISOString()),
            amount: "",
            category: '',
            categoryId: null,
            notes: '',
        },
        onSubmit: async (data) => {
            try {
                const values = data.value

                if (!values.categoryId) throw new Error('Выберите категорию')

                await addTransaction({
                    type: values.type,
                    categoryId: values.categoryId,
                    amount: +values.amount,
                    userId: user?.id,
                    date: new Date(values.date).toISOString(),
                    commentary: values.notes
                })

                utils.transaction.get.invalidate()
                utils.transaction.get.refetch()

                
                toast.success('Транзакция успешно добавлена')
                setOpen(false)
            } catch (e) {
                toast.error('Ошибка добавления транзакции: ' + e.message)
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
                {!onOpenChange && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="font-semibold">Добавить {type === 'IN' ? 'доход' : 'трату'}</DialogTitle>
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
            {!onOpenChange && <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>}
            <DrawerContent>
                <DrawerHeader className="text-center">
                    <DrawerTitle className="text-xl font-semibold">Добавить {type === 'IN' ? 'доход' : 'трату'}</DrawerTitle>
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