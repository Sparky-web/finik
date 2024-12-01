
import { LabelGroup } from "~/components/custom/label-group"
import { FormFieldInterface } from "./form-text-field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"

type Option = {
    label: string
    value: string
}

interface FormFieldSelectInterface extends FormFieldInterface {
    options: ({
        label: string
        values: Option[]
    } | Option)[]
}

export function FormSelectField(props: FormFieldSelectInterface) {
    return (
        <LabelGroup>
            {props.children || ''}
            <Select
                disabled={!props.options.length}
                value={props.field.state.value}
                onValueChange={(value) => props.field.handleChange(value)}
            >

                <SelectTrigger>
                    <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {props.options.map(e => {
                            if ('values' in e) {
                                return (
                                    <SelectGroup key={e.label}>
                                        <SelectLabel>{e.label}</SelectLabel>
                                        {e.values.map(e => (
                                            <SelectItem value={e.value} key={e.value}>{e.label}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                )
                            }

                            return (
                                <SelectItem value={e.value} key={e.value}>{e.label}</SelectItem>
                            )
                        })}
                    </SelectGroup>
                </SelectContent>
            </Select >
            {
                Boolean(props.field.state.meta.errors.length) && <span className="text-red-500 text-xs">
                    {props.field.state.meta.errors.join(', ')}
                </span>
            }
        </LabelGroup >
    )
}