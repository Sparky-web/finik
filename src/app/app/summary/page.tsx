'use client'
import { H1, H2, H3, H4 } from "~/components/ui/typography";
import { auth } from "~/server/auth";
import wave from "./_lib/images/wave.png"
import Image from "next/image";
import Card, { CardTitle } from "~/app/_lib/components/card";
import { ArrowDownLeft, ArrowDownRight, ArrowUpRight, Pencil, Wallet } from "lucide-react";
import ActionsMenu from "~/app/_lib/components/menu/actions";
import ClientActions from "./_lib/components/client-actions";
import { useAppSelector } from "~/app/_lib/client-store";


export default function Summary() {
    const user = useAppSelector(e => e.user?.user)

    // const {data} = api

    return (
        <div className="grid gap-6">
            <div className="flex items-center content-center gap-4">
                <Image src={wave} alt="wave" width={24} height={24} objectFit="contain" />

                <H2>
                    Добро пожаловать, {user?.name}!
                </H2>
            </div>

            <div className="grid gap-4 max-md:flex max-md:flex-reverse max-md:flex-col-reverse">
                <div className="grid lg:grid-cols-3 gap-4">
                    <Card className="content-between">
                        <div className="gap-2 grid ">
                            <CardTitle className="flex items-center gap-3">
                                <Wallet className="w-5 h-5" />
                                Баланс
                            </CardTitle>
                            <H2>60 000 ₽</H2>
                        </div>
                        <span className="text-sm text-muted-foreground">
                            на накопительном счете 90 000 ₽
                        </span>
                    </Card>
                    <Card className="content-between">
                        <div className="gap-2 grid ">
                            <CardTitle className="flex items-center gap-3">
                                <ArrowDownLeft className="w-5 h-5" />
                                Доходы в этом месяце
                            </CardTitle>
                            <H2>60 000 ₽</H2>
                        </div>
                        <span className="text-sm text-muted-foreground text-green-500">
                            на 2% больше, чем в предыдущем месяце
                        </span>
                    </Card>
                    <Card className="content-between">
                        <div className="gap-2 grid ">
                            <CardTitle className="flex items-center gap-3">
                                <ArrowUpRight className="w-5 h-5" />
                                Траты в этом месяце
                            </CardTitle>
                            <H2>60 000 ₽</H2>
                        </div>
                        <span className="text-sm text-muted-foreground text-red-600">
                            на 2% больше, чем в предыдущем месяце
                        </span>
                    </Card>
                </div>
                <ClientActions />
            </div>
        </div>
    )
}