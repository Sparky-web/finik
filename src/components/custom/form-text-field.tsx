import { FieldApi } from "@tanstack/react-form"
import { LabelGroup } from "~/components/custom/label-group"
import { Input } from "~/components/ui/input"
import { cn } from "~/lib/utils"

import ChildrenInterface from "~/types/children-interface"

export interface FormFieldInterface extends ChildrenInterface, React.HTMLAttributes<HTMLInputElement> {
    field: FieldApi<any, any, any>
}

export function FormTextField({children, field, ...props}: FormFieldInterface) {
    return (
        <LabelGroup>
            {children || ''}
            <Input
                value={field.state.value}
                onChange={e => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className={cn(field.state.meta.errors.length && 'border-red-500 !ring-0')}
                {...props}
            />
            {Boolean(field.state.meta.errors.length) && <span className="text-red-500 text-xs">
                {field.state.meta.errors.join(', ')}
            </span>}
        </LabelGroup>
    )
}