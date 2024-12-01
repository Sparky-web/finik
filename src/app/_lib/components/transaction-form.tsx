import { Category } from "@prisma/client"
import { FormApi, ReactFormApi, useField } from "@tanstack/react-form"
import { Check, ChevronsUpDown, Loader } from "lucide-react"
import React from "react"
import { useEffect, useRef } from "react"
import { FormSelectField } from "~/components/custom/form-select-field"
import { FormTextField } from "~/components/custom/form-text-field"
import { Label } from "~/components/custom/label-group"
import { Button } from "~/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "~/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"

interface FormInterface {
    type: 'IN' | 'OUT'
    amount: number
    category: string,
    categoryId: number,
    notes: string
}


interface TransactionFormProps {
    form: FormApi<FormInterface, undefined> & ReactFormApi<FormInterface>,
}


const mockCategories: (Category)[] = [
    { id: 1, type: 'OUT', name: 'Супермаркеты', icon: 'ShoppingBasket', color: '#FF4444' },
    { id: 2, type: "OUT", name: 'Переводы', icon: 'ArrowRightCircle', color: '#33AA33' },
    { id: 3, type: "OUT", name: 'Зарплата', icon: 'Wallet', color: '#4444FF' },
    { id: 4, type: "IN", name: 'Зарплата', icon: 'Wallet', color: '#4444FF' },
]


export default function TransactionForm({ form }: TransactionFormProps) {
    const ref = useRef()

    const typeField = form.useField({
        name: "type",
    })

    console.log(form.state.values.date)

    const {data: categories} = api.category.get.useQuery()

    const [popoverOpen, setPopoverOpen] = React.useState(false)

    const categoriesFiltered = (categories || []).filter((category) => category.type === typeField.state.value)

    // useEffect(() => {
    //     if (typeField.state.value) {
    //         form.setFieldValue('categoryId', categoriesFiltered[0]?.id)
    //     } else {
    //         form.setFieldValue('categoryId', null)
    //     }
    // }, [typeField.state.value])

    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
        }} className="grid gap-2">
            {/* <form.Field name="type">
                {field => <FormSelectField options={[
                    {
                        label: 'Доход',
                        value: "IN"
                    },
                    {
                        label: 'Трата',
                        value: "OUT"
                    }
                ]} field={field}>
                    <Label>Тип транзакции</Label>
                </FormSelectField>
                }
            </form.Field> */}

            <form.Field name="amount">
                {field => <FormTextField field={field} type="number">
                    <Label>Сумма (₽)</Label>
                </FormTextField>
                }
            </form.Field>

            <form.Field name="categoryId" >
                {field => (
                    <div className="grid gap-1.5">
                        <Label>Категория</Label>
                        <Popover open={popoverOpen} onOpenChange={setPopoverOpen} modal={true}>
                            <PopoverTrigger asChild>
                                <Button
                                    disabled={!typeField.state.value}
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    size="lg"
                                    ref={ref}
                                    className="w-full justify-between px-3"
                                >
                                    {field.state.value
                                        ? categoriesFiltered.find((category) => category.id === field.state.value)?.name || 'Выберите категорию...'
                                        : "Выберите категорию..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 " style={{
                                width: ref.current?.clientWidth || 'auto'
                            }}>
                                <Command>
                                    <CommandInput placeholder="Поиск категории..." />
                                    <CommandEmpty>Категория не найдена.</CommandEmpty>
                                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                                        {categoriesFiltered.map((category) => (
                                            <CommandItem
                                                key={category.id}
                                                value={category.id}
                                                onSelect={() => {
                                                    field.handleChange(category.id)
                                                    setPopoverOpen(false)
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        category.id === field.state.value ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                <div className="flex justify-between items-center w-full text-sm">
                                                    {category.name}
                                                    <div
                                                        className="w-3 h-3 rounded-full mr-2"
                                                        style={{ backgroundColor: category.color }}
                                                    />
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {!!field.state.meta.errors.length && <p className="text-xs text-red-500">{
                            field.state.meta.errors.join(', ')
                        }</p>}
                    </div>
                )}

            </form.Field>

            <form.Field name="notes">
                {field => <FormTextField field={field}>
                    <Label>Комментарий</Label>
                </FormTextField>
                }
            </form.Field>

            <form.Field name="date">
                {field => (
                    <div className="grid gap-2 grid-cols-2">
                        <FormTextField field={field} type="datetime-local">
                            <Label>Дата</Label>
                        </FormTextField>
                    </div>
                )
                }
            </form.Field>

            <form.Subscribe selector={(form) => [form.isSubmitting, form.canSubmit]}>
                {([isSubmitting, canSubmit]) => (

                    <Button type="submit" disabled={!canSubmit || isSubmitting} className=" mt-3 w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg transform transition duration-300 hover:scale-101">
                        {isSubmitting && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                        Сохранить
                    </Button>
                )}
            </form.Subscribe>
        </form>
    )
}

