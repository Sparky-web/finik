"use client"

import * as React from "react"
import DateTime from "~/lib/utils/datetime"
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react'
import { Button } from "~/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Calendar } from "~/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover"
import { cn } from "~/lib/utils"
import { PopoverAnchor } from "@radix-ui/react-popover"

interface DateRange {
    dbeg: DateTime
    dend: DateTime
}

interface PeriodSelectorProps {
    value?: DateRange
    onChange?: (range: DateRange) => void
    className?: string
}

type PeriodOption = {
    label: string
    getValue: () => DateRange
    period?: 'week' | 'month' | '3months' | 'year' | 'all'
}

export function PeriodSelector({ value, onChange, className }: PeriodSelectorProps) {
    const [internalValue, setInternalValue] = React.useState<DateRange>(() => ({
        dbeg: DateTime.now().startOf('month'),
        dend: DateTime.now().endOf('month')
    }))

    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
    const [customRange, setCustomRange] = React.useState<DateRange | null>(null)

    const currentValue = value || internalValue
    const handleChange = (newValue: DateRange) => {
        onChange ? onChange(newValue) : setInternalValue(newValue)
    }

    const periodOptions: PeriodOption[] = [
        {
            label: "Текущая неделя",
            getValue: () => ({
                dbeg: DateTime.now().startOf('week'),
                dend: DateTime.now().endOf('week')
            }),
            period: 'week'
        },
        {
            label: DateTime.now().toFormat('LLLL'),
            getValue: () => ({
                dbeg: DateTime.now().startOf('month'),
                dend: DateTime.now().endOf('month')
            }),
            period: 'month'
        },
        {
            label: "3 месяца",
            getValue: () => ({
                dbeg: DateTime.now().minus({ months: 2 }).startOf('month'),
                dend: DateTime.now().endOf('month')
            }),
            period: '3months'
        },
        {
            label: DateTime.now().toFormat('yyyy год'),
            getValue: () => ({
                dbeg: DateTime.now().startOf('year'),
                dend: DateTime.now().endOf('year')
            }),
            period: 'year'
        },
        {
            label: "За всё время",
            getValue: () => ({
                dbeg: DateTime.fromISO('2000-01-01'),
                dend: DateTime.now()
            }),
            period: 'all'
        }
    ]

    const getCurrentPeriodLabel = () => {
        if (!currentValue.dbeg || !currentValue.dend) return 'не выбрано'

        const option = periodOptions.find(opt => {
            const range = opt.getValue()
            return range.dbeg.hasSame(currentValue.dbeg, 'day') &&
                range.dend.hasSame(currentValue.dend, 'day')
        })

        return option?.label || `${currentValue.dbeg?.toFormat('d MMMM yyyy')}  -  ${currentValue.dend?.toFormat('d MMMM yyyy')}`
    }

    const [periodType, setPeriodType] = React.useState<PeriodOption['period'] | undefined>('month')


    const handleNavigate = (direction: 'prev' | 'next') => {
        const shift = direction === 'prev' ? -1 : 1

        let newDbeg: DateTime
        let newDend: DateTime

        switch (periodType) {
            case 'week':
                newDbeg = currentValue.dbeg.plus({ weeks: shift })
                newDend = currentValue.dend.plus({ weeks: shift })
                break
            case 'month':
                newDbeg = currentValue.dbeg.plus({ months: shift })
                newDend = newDbeg.endOf('month')
                break
            case '3months':
                newDbeg = currentValue.dbeg.plus({ months: 3 * shift })
                newDend = newDbeg.plus({ months: 2 }).endOf('month')
                break
            case 'year':
                newDbeg = currentValue.dbeg.plus({ years: shift })
                newDend = newDbeg.endOf('year')
                break
            default:
                const duration = currentValue.dend.diff(currentValue.dbeg)
                newDbeg = currentValue.dbeg.plus({ milliseconds: duration.milliseconds * shift })
                newDend = currentValue.dend.plus({ milliseconds: duration.milliseconds * shift })
        }

        handleChange({ dbeg: newDbeg, dend: newDend })
    }

    const handleCustomRangeSelect = (range: { from: Date; to: Date }) => {
        if (range.from || range.to) {
            const newRange = {
                dbeg: range.from ? DateTime.fromJSDate(range.from) : null,
                dend: range.to ? DateTime.fromJSDate(range.to) : null
            }

            setCustomRange(newRange)
            handleChange(newRange)
        }
    }

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        handleNavigate('prev')
                    }}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <PopoverAnchor asChild>
                            <Button variant="secondary" className="min-w-[300px] text-xs ">
                                <CalendarIcon className="h-4 w-4" />
                                {getCurrentPeriodLabel()}
                            </Button>
                        </PopoverAnchor>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-[300px]">
                        {periodOptions.map((option, index) => (
                            <DropdownMenuItem
                                key={index}
                                onClick={() => {
                                    if(option.period) setPeriodType(option.period)
                                    handleChange(option.getValue())
                                }}
                            >
                                {option.label}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => {
                            setPeriodType(undefined)
                            handleChange({
                                dbeg: null,
                                dend: null
                            })

                            setTimeout(() => {
                                setIsCalendarOpen(true)
                            }, 200)
                        }}>
                            Указать период...
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleNavigate('next')}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={currentValue.dbeg?.toJSDate() || new Date()}
                        selected={{
                            from: currentValue.dbeg?.toJSDate() || undefined,
                            to: currentValue.dend?.toJSDate() || undefined,
                        }}
                        onSelect={handleCustomRangeSelect}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

