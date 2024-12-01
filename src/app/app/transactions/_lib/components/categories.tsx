"use client"

import * as React from "react"
import Card from "~/app/_lib/components/card"
import { Button } from "~/components/ui/button"
import { ChevronDown, ChevronUp } from 'lucide-react'
import { PieChart, Pie, Cell, Label } from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "~/components/ui/chart"

interface Category {
    name: string
    amount: number
    color: string
}

interface ExpenseCategoriesProps {
    total: number
    type: "IN" | "OUT"
    categories: Category[]
}

export default function ExpenseCategories({
    total,
    type,
    categories
}: ExpenseCategoriesProps) {
    const [expanded, setExpanded] = React.useState(false)

    const sortedCategories = [...categories].sort((a, b) => b.amount - a.amount)
    const mainCategories = sortedCategories.slice(0, 8)

    const otherAmount = sortedCategories.slice(8)?.reduce((sum, cat) => sum + cat.amount, 0)
    if (otherAmount > 0) {
        mainCategories.push({ name: "Остальное", amount: otherAmount, color: "#808080" })
    }

    const displayedCategories = React.useMemo(() => {
        if (!sortedCategories.length) return []
        if (expanded) return sortedCategories

        return mainCategories
    }, [sortedCategories, expanded])

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('ru-RU').format(amount)
    }

    const chartConfig = React.useMemo(() => {
        return Object.fromEntries(
            mainCategories.map(cat => [cat.name, { label: cat.name, color: cat.color }])
        )
    }, [mainCategories])

    if (!categories || categories.length === 0) {
        return (
            <Card className="w-full mx-auto">
                <p className="text-center text-gray-500">Нет данных о категориях расходов.</p>
            </Card>
        )
    }

    return (
        <Card className="w-full py-6">
            <div className="flex flex-col lg:flex-row items-start gap-8">
                <div className="w-full lg:w-2/3">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {displayedCategories.map((category) => (
                            <div
                                onClick={() => {
                                    category.name === 'Остальное' ? setExpanded(true) : {}
                                }}
                                key={category.name}
                                className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 cursor-pointer hover:bg-gray-200 transition-colors"
                            >
                                <div
                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: category.color }}
                                />
                                <span className="text-xs text-gray-700">{category.name}</span>
                                <span className="text-xs font-medium">
                                    {formatAmount(category.amount)} ₽
                                </span>
                            </div>
                        ))}
                    </div>
                    {expanded && <Button
                        variant="tenary"
                        size="xs"
                        onClick={() => setExpanded(!expanded)}
                        className="w-fit"
                    >
                        <>
                            <ChevronUp className="h-4 w-4" />
                            Свернуть остальное
                        </>
                    </Button>}
                </div>
                <div className="w-full lg:w-1/3 flex flex-col items-center">
                    <ChartContainer
                        config={chartConfig}
                        className="w-60 h-48"
                    >
                        <PieChart>
                            <ChartTooltip
                                content={({ payload }) => {
                                    if (payload && payload.length > 0) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="bg-white px-2 py-1 rounded-xl shadow flex gap-2 items-center">
                                                <div
                                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: data.color }}
                                                />
                                                <p className="text-sm font-semibold">{data.name}</p>
                                                <p className="text-sm whitespace-nowrap">
                                                    {formatAmount(data.amount)} ₽
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Pie
                                data={mainCategories}
                                dataKey="amount"
                                nameKey="name"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                            >
                                {mainCategories.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                <Label
                                    content={({ viewBox }) => {
                                        const { cx, cy } = viewBox
                                        return (
                                            <text x={cx} y={cy} fill="#333" textAnchor="middle" dominantBaseline="central">
                                                <tspan x={cx} y={cy - 12} className="text-sm text-muted-foreground">
                                                    {type === 'IN' ? 'Доходы' : 'Расходы'}
                                                </tspan>
                                                <tspan x={cx} y={cy + 12} className="text-lg font-bold">
                                                    {formatAmount(total)} ₽
                                                </tspan>
                                            </text>
                                        )
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </div>
            </div>
        </Card>
    )
}

