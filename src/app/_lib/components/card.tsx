import { H3, H4 } from "~/components/ui/typography"
import { cn } from "~/lib/utils"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
}

export default function Card({ children, ...props }: Props) {
    return (
        <div {...props} className={cn("bg-card rounded-2xl py-4 px-5 shadow-sm grid gap-4 content-start", props.className)} >
            {children}
        </div>
    )
}

export function CardTitle({ children, ...props }: Props) {
    return (
        <H4 {...props} className={cn('font-semibold', props.className)}>{children}</H4>
    )
}