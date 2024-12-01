'use client'

import React from 'react'
import { AccountModificationDialog } from './edit-account-dialog'
import { TransferDialog } from './transfer-dialog'

import { Pencil, ArrowDownRight, ArrowUpRight, ArrowRightLeft } from "lucide-react"
import ActionsMenu from "~/app/_lib/components/menu/actions"
import { AddTransactionDialog } from './add-tranasction'


export default function ClientActions() {

    const [transferOpen, setTransferOpen] = React.useState(false)
    const [addIncomeOpen, setAddIncomeOpen] = React.useState(false)
    const [addExpenseOpen, setAddExpenseOpen] = React.useState(false)

    const actions = [
      
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
            <TransferDialog open={transferOpen} onOpenChange={setTransferOpen} onTransfer={() => { }} />
            <AddTransactionDialog type="IN" customOpen={addIncomeOpen} onOpenChange={setAddIncomeOpen} />
            <AddTransactionDialog type="OUT" customOpen={addExpenseOpen} onOpenChange={setAddExpenseOpen} />
        </>

    )

}



export function AccountManagementPage() {
    const [defaultBalance, setDefaultBalance] = React.useState(10000)
    const [savingsBalance, setSavingsBalance] = React.useState(5000)

    const handleDefaultAccountSave = (newBalance: number) => {
        setDefaultBalance(newBalance)
    }

    const handleSavingsAccountSave = (newBalance: number) => {
        setSavingsBalance(newBalance)
    }

    const handleTransfer = (from: string, to: string, amount: number) => {
        if (from === 'default' && to === 'savings') {
            setDefaultBalance(prev => prev - amount)
            setSavingsBalance(prev => prev + amount)
        } else if (from === 'savings' && to === 'default') {
            setSavingsBalance(prev => prev - amount)
            setDefaultBalance(prev => prev + amount)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Управление счетами</h1>
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Основной счет</h2>
                    <p className="text-xl mb-4">Баланс: {defaultBalance.toFixed(2)} ₽</p>
                    <AccountModificationDialog
                        type="default"
                        currentBalance={defaultBalance}
                        onSave={handleDefaultAccountSave}
                    />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Накопительный счет</h2>
                    <p className="text-xl mb-4">Баланс: {savingsBalance.toFixed(2)} ₽</p>
                    <AccountModificationDialog
                        type="savings"
                        currentBalance={savingsBalance}
                        onSave={handleSavingsAccountSave}
                    />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Перевод между счетами</h2>
                    <TransferDialog onTransfer={handleTransfer} />
                </div>
            </div>
        </div>
    )
}

