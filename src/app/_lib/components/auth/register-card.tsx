'use client'

import Card, { CardTitle } from "~/app/_lib/components/card"
import { H1, H2, H3, P } from "~/components/ui/typography"
import Logo from "~/app/_lib/images/urtk-logo.png"
import Image from "next/image"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { getSession, signIn } from "next-auth/react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "../../client-store"
import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import TextFormField from "../text-form-field"
import { z } from "~/lib/utils/zod-russian"
import { Combobox } from "../combobox"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"
import { setUser } from "../../client-store/_lib/slices/user"

export default function LoginCard() {
    const { mutateAsync: register } = api.auth.register.useMutation();

    const dispatch = useAppDispatch()

    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        onSubmit: async (data) => {
            try {
                if (!data.value.password || !data.value.confirmPassword) throw new Error('пароли не совпадают')

                const { name, email, password } = data.value

                await register({ name, email, password });

                const res = await signIn('credentials', {
                    email,
                    password,
                    redirect: false
                });

                if (res?.error) {
                    console.error(res.error)
                    throw new Error(res.error)
                }

                const session = await getSession()

                if (session?.user) {
                    dispatch(setUser(session.user))
                }

                toast.success('Регистрация прошла успешно')
                form.reset()

                navigation.push('/')
            } catch (e) {
                toast.error('Ошибка регистрации: ' + e.message)
            }
        },
        validatorAdapter: zodValidator(),
    })

    const navigation = useRouter()

    return (
        <Card className="w-[500px] max-w-full p-6">
            <form className="grid gap-9" onSubmit={e => {
                e.preventDefault()
                form.handleSubmit()
            }}>
                <div className="flex gap-4 justify-between flex-wrap">
                    <H2>Академикс</H2>
                    <Image src={Logo} alt="logo" width={136} height={26} objectFit="contain" />
                </div>

                <div className="grid gap-4">
                    <div className="grid gap-2 md:text-center">
                        <H1 className="max-md:text-[20px] text-[24px]">Регистрация на платформе</H1>
                        <P className="leading-6 max-md:text-[14px] max-md:leading-5">
                            Сохранение вашего расписания, избранные расписания и больше
                        </P>
                    </div>
                    <div className="grid gap-3">

                        <form.Field name="name"
                            validators={{
                                onChange: z.string().min(1)
                            }}
                        >
                            {field => <TextFormField field={field} label="Имя" inputProps={{ placeholder: "Ваше имя" }} />}
                        </form.Field>

                        <form.Field name="email"
                            validators={{
                                onChange: z.string().email()
                            }}
                        >
                            {field => <TextFormField field={field} label="Email" inputProps={{ placeholder: "Ваш email" }} />}
                        </form.Field>

                        <form.Field name="password"
                            validators={{
                                onChange: z.string().min(8)
                            }}
                        >
                            {field => <TextFormField field={field} label="Пароль" inputProps={{ placeholder: "Ваш пароль", type: 'password' }} />}
                        </form.Field>

                        <form.Field name="confirmPassword"
                            validators={{
                                onChange: z.string().min(8)
                            }}
                        >
                            {field => <TextFormField field={field} label="Повторите пароль" inputProps={{ placeholder: "Ваш пароль", type: 'password' }} />}
                        </form.Field>

                        <form.Subscribe selector={(form) => [form.isPristine, form.isSubmitting, form.canSubmit]}>
                            {([isPristine, isSubmitting, canSubmit]) => (
                                <Button disabled={isPristine || isSubmitting || !canSubmit} type="submit" size={'lg'}>
                                    Зарегистрироваться
                                </Button>
                            )}
                        </form.Subscribe>

                        <P className="leading-6 md:text-center text-sm mt-3">
                            Если у Вас уже есть учетная запись - <Link href={'/auth/signin'} className="text-primary">
                                нажмите здесь, чтобы войти
                            </Link>
                        </P>
                    </div>
                </div>
            </form>
        </Card>
    )
}
