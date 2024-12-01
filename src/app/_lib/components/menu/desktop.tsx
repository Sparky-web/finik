import { usePathname } from "next/navigation";
import { MenuItem } from ".";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { H2 } from "~/components/ui/typography";
import Logo from "~/images/logo.svg"
import Image from "next/image";

interface MenuProps {
    data: MenuItem[]
}

export default function DesktopMenu({ data }: MenuProps) {
    const pathname = usePathname()

    return (
        <div className="hidden lg:grid gap-6 bg-card shadow-xl px-5 content-start relative z-10 pt-8 ">
            <div className="flex gap-2 content-center items-center">
                <Image src={Logo} alt="Академикс" width={36} height={36} style={{
                    // transform: "translateY(-2px)"
                }} />
                <div className="grid gap-0">
                    <H2>
                        Финик
                    </H2>
                    <span className="text-muted-foreground text-sm">Ваш финансовый учет</span>
                </div>
            </div>
            <div className="grid gap-2">
                {data.map(item => {
                    const isActive = pathname.includes(item.path)
                    return (
                        <Link key={item.title} href={item.path} className={cn(
                            "transition-colors flex gap-3 content-center items-center min-h-12 rounded-xl px-4 py-3 hover:bg-muted",
                            isActive && 'bg-primary/10 text-primary hover:bg-primary/15'
                        )}>
                            <item.icon className="w-5 h-5 " />
                            <div className={cn(
                                "text-sm font-medium ",
                                isActive && 'text-primary'
                            )}>{item.title}</div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}