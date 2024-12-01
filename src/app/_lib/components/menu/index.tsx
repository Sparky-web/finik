'use client'
import { CalendarDays, Home, User, Upload, Users, File, AlertCircleIcon, Bug, ArrowLeftRight, Wallet, MedalIcon, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, ReactElement, ReactNode } from "react";
import { cn } from "~/lib/utils";
import MobileMenu from "./mobile";
import DesktopMenu from "./desktop";
import { useAppSelector } from "../../client-store";
import { P } from "~/components/ui/typography";


const menu: MenuItem[] = [
    {
        title: 'Главная',
        path: '/app/summary',
        icon: Home
    },
    // {
    //     title: 'Тестовая страница',
    //     path: '/app/test',
    //     icon: Bug
    // },
    {
        title: 'Транзакции',
        path: '/app/transactions',
        icon: ArrowLeftRight
    },
    // {
    //     title: 'Счета',
    //     path: '/app/accounts',
    //     icon: Wallet
    // },
    {
        title: 'Вызовы',
        path: '/app/challanges',
        icon: MedalIcon
    },
    {
        title: "Выйти",
        path: "/auth/signout",
        icon: LogOut 
    }

    // {
    //     title: 'Загрузить расписание',
    //     path: '/lk/add-schedule',
    //     icon: Upload
    // }
]

export interface MenuItem {
    title: string
    path: string
    icon: FC<any>
}

export default function Menu() {
    const pathname = usePathname()

    const user = useAppSelector(e => e.user?.user)

    const desktopMenu = [...menu]
    if (user && user.isAdmin) {
        desktopMenu.push({
            title: 'Управление расписанием',
            path: '/lk/add-schedule',
            icon: Upload
        })

        desktopMenu.push({
            title: 'Пользователи',
            path: '/lk/users',
            icon: Users
        })

        desktopMenu.push({
            title: 'Отчеты',
            path: '/lk/reports',
            icon: File
        })

        desktopMenu.push({
            title: 'Отчеты об ошибках',
            path: '/lk/error-reports',
            icon: AlertCircleIcon
        })
    }

    return (
        <>
            <MobileMenu data={menu} />
            <DesktopMenu data={desktopMenu} />
        </>
    )
}