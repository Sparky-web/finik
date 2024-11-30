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

export default function Transactions() {
    return (
        <div className="grid gap-6">
            <H2>Транзакции</H2>
            <div className="grid gap-4">
                <Tabs>
                    <TabsList>
                        <TabsTrigger value="account">Основной счет</TabsTrigger>
                        <TabsTrigger value="password">Накопительный счет</TabsTrigger>
                    </TabsList>
                </Tabs>

                <ClientActions />
                <Card className="w-full flex justify-between max-md:flex-col gap-4">
                    <PeriodSelector />
                </Card>
                <ExpenseCategories />
            </div>
        </div>
    )

}