'use client'

import { Pencil, ArrowDownRight, ArrowUpRight, ArrowRightLeft } from "lucide-react"
import ActionsMenu from "~/app/_lib/components/menu/actions"

const actions = [
    {
        title: 'Перевод между счетами',
        icon: ArrowRightLeft,
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