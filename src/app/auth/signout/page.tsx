'use client'
import { set } from "date-fns"
import { tr } from "date-fns/locale"
import { signOut } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import React from "react"
import { useEffect } from "react"
import { P } from "~/components/ui/typography"

export default function SignOutPage() {
    useEffect(() => {
        signOut({
            redirectTo: '/auth/signin',
        })
    }, [])


    return (
        <div className="flex items-center justify-center w-full gap-3 mt-5 mb-5">
            <h1>Выход...</h1>
        </div>
    )
}