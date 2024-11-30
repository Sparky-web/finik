'use client'
import { cn } from "~/lib/utils"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface ActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    actions: {
        title: string
        icon: React.FC<any>
        onClick?: () => void
        href?: string
    }[]
}


export default function ActionsMenu({ actions, ...props }: ActionsProps) {
    const router = useRouter()

    return (
        <div {...props} className={cn("w-full py-3 px-3 bg-card flex shadow-sm  justify-around items-center gap-3 rounded-xl mobile-menu", props.className || '')}
        >
            {actions.map(item => {
                return (
                    <Link href={item.href || "#"} key={item.title} onClick={e => {
                        e.preventDefault()
                        if (item.onClick) item.onClick()
                        else if(item.href) router.push(item.href)
                    }} className="grid gap-1 jusrify-center justify-items-center flex-1"> 
                        <div className={
                            cn(
                                "w-10 h-10 py-2 rounded-xl bg-muted grid justify-center bg-primary/10 text-primary",
                            )}>
                            <item.icon className="w-6 h-6 " />
                        </div>
                        <div className={cn(
                            "text-xs font-medium text-center ",
                        )}>{item.title}</div>
                    </Link>
                )
            })}
        </div>
    )
}


