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

export default function Transactions() {
    return (
        <div className="grid gap-6">
            <H2>Транзакции</H2>
            <div className="grid gap-4">
                <div className="flex gap-4 flex-wrap">
                    <Tabs value="default">
                        <TabsList>
                            <TabsTrigger value="default">Основной счет</TabsTrigger>
                            <TabsTrigger value="savings">Накопительный счет</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <Tabs value="out">
                        <TabsList>
                            <TabsTrigger value="out">Траты</TabsTrigger>
                            <TabsTrigger value="in">Доходы</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="ml-auto">

                    <PeriodSelector />
                    </div>
                </div>


                <ClientActions />


                {/* <Card className="w-full flex justify-between max-md:flex-col gap-4">
                </Card> */}
                <ExpenseCategories />
            </div>

            <TransactionList />
        </div>
    )

}