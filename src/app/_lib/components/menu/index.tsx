'use client'
import { CalendarDays, Home, User, Upload, Users, File, AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, ReactElement, ReactNode } from "react";
import { cn } from "~/lib/utils";
import MobileMenu from "./mobile";
import DesktopMenu from "./desktop";
import { useAppSelector } from "../../client-store";


const menu: MenuItem[] = [
    {
        title: 'Тестовая страница',
        path: '/app/test',
        icon: Home
    },
    
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
    if(user && user.isAdmin) { 
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