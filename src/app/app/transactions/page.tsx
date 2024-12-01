'use client'
import { H2 } from "~/components/ui/typography";
import ExpenseCategories from "./_lib/components/categories";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "~/components/ui/tabs"
import { PeriodSelector } from "~/app/_lib/components/period-selector";
import ClientActions from "./_lib/components/client-actions";
import Card from "~/app/_lib/components/card";
import TransactionList from "./_lib/components/transactions-list";
import { api } from "~/trpc/react";
import { useState } from "react";
import { DateTime } from "luxon";

export default function Transactions() {
    // const {data} = api.transaction.get.useQuery({})
    // const {data: transactions} = api.user.getIn.useQuery()
    // console.log(data)

    const [accountType, setAccountType] = useState<'default' | 'savings'>('default')
    const [period, setPeriod] = useState<{
        dbeg: Date,
        dend: Date
    }>({
        dbeg: DateTime.now().startOf('month').toJSDate(),
        dend: DateTime.now().endOf('month').toJSDate()
    })

    const [type, setType] = useState<'IN' | 'OUT'>('IN')

    const { data, isPending } = api.transaction.get.useQuery({
        dbeg: period.dbeg,
        dend: period.dend,
        limit: 100,
        offset: 0
    })


    return (
        <div className="grid gap-6">
            <H2>Транзакции</H2>
            <div className="grid gap-4">
                <div className="flex gap-4 flex-wrap">
                    <Tabs value={accountType} onValueChange={setAccountType}>
                        <TabsList>
                            <TabsTrigger value="default">Основной счет</TabsTrigger>
                            <TabsTrigger value="savings">Накопительный счет</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <Tabs value={type} onValueChange={setType}>
                        <TabsList>
                            <TabsTrigger value="OUT">Траты</TabsTrigger>
                            <TabsTrigger value="IN">Доходы</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="ml-auto">

                        <PeriodSelector value={{
                            dbeg: DateTime.fromJSDate(period.dbeg),
                            dend: DateTime.fromJSDate(period.dend)
                        }} onChange={e => {
                            setPeriod({
                                dbeg: e.dbeg.toJSDate(),
                                dend: e.dend.toJSDate()
                            })
                        }} />

                    </div>
                </div>

                <ClientActions />
                {
                    data && <>
                        <ExpenseCategories total={data.summary[type]?.total || []} categories={data.summary[type]?.categories || []} type={type} />
                    </>
                }
            </div>


            {data && <TransactionList days={data.transactions[type.toLowerCase()]} />}
        </div>
    )

}