'use client'

import { Pencil, ArrowDownRight, ArrowUpRight } from "lucide-react"
import React from "react"
import ActionsMenu from "~/app/_lib/components/menu/actions"
import { AddTransactionDialog } from "~/app/app/transactions/_lib/components/add-tranasction"




export default function ClientActions() {
    const [addIncomeOpen, setAddIncomeOpen] = React.useState(false)
    const [addExpenseOpen, setAddExpenseOpen] = React.useState(false)
    

    const actions = [
        {
            title: 'Изменить баланс',
            icon: Pencil,
            href: "/app/accounts",
        },
        {
            title: 'Добавить доход',
            icon: ArrowDownRight,
            onClick: () => {
                setAddIncomeOpen(true)
            }
        },
        {
            title: 'Добавить трату',
            icon: ArrowUpRight,
            onClick: () => {
                setAddExpenseOpen(true)
            }
        }
    ]

    return (
        <>
            <ActionsMenu actions={actions} />
            <AddTransactionDialog type="IN" customOpen={addIncomeOpen} onOpenChange={setAddIncomeOpen} />
            <AddTransactionDialog type="OUT"  customOpen={addExpenseOpen} onOpenChange={setAddExpenseOpen} />
        </>
    )

}