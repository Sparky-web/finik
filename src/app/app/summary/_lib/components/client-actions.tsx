'use client'

import { Pencil, ArrowDownRight, ArrowUpRight } from "lucide-react"
import ActionsMenu from "~/app/_lib/components/menu/actions"

const actions = [
    {
        title: 'Изменить баланс',
        icon: Pencil,
    },
    {
        title: 'Добавить доход',
        icon: ArrowDownRight,
    },
    {
        title: 'Добавить трату',
        icon: ArrowUpRight,
    }
]

export default function ClientActions() {
    return (
        <ActionsMenu actions={actions} />
    )

}