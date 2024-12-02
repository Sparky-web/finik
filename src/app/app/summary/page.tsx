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
import { api } from "~/trpc/react";
import { formatAmount } from "../transactions/_lib/components/categories";
import { ChallengeCard } from "../challanges/_lib/components/challange-card";


export default function Summary() {
    const user = useAppSelector(e => e.user?.user)
    const [_, { data: challanges }] = api.challengeUser.getAll.useSuspenseQuery()
    const [_1, { data }] = api.user.getMonth.useSuspenseQuery()

    if (!challanges || !data) return <div>Loading...</div>

    const userData = data[0]

    const challangesData = [
        ...challanges.in_progress,
        ...challanges.new.slice(0, 3),
        ...challanges.completed.slice(0, 1),
        ...challanges.failed.slice(0, 1)
    ]
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
                            <H2>{formatAmount(userData?.balance)} ₽</H2>
                        </div>

                    </Card>
                    <Card className="content-between">
                        <div className="gap-2 grid ">
                            <CardTitle className="flex items-center gap-3">
                                <ArrowDownLeft className="w-5 h-5" />
                                Доходы в этом месяце
                            </CardTitle>
                            <H2>{formatAmount(userData?.in)} ₽</H2>
                        </div>
                        {userData?.inPercent !== null && <span className="text-sm text-muted-foreground text-green-500">
                            {/* на {userData?.inPercent}% больше, чем в предыдущем месяце */}
                            {userData?.inPercent > 0 && <span className="text-green-500">на {userData?.inPercent.toFixed(0)}% больше, чем в предыдущем месяце</span>}
                            {userData?.inPercent < 0 && <span className="text-red-500">на {Math.abs(userData?.inPercent).toFixed(0)}% меньше, чем в предыдущем месяце</span>}
                        </span>}
                    </Card>
                    <Card className="content-between">
                        <div className="gap-2 grid ">
                            <CardTitle className="flex items-center gap-3">
                                <ArrowUpRight className="w-5 h-5" />
                                Траты в этом месяце
                            </CardTitle>
                            <H2>
                                {formatAmount(userData?.out)} ₽
                            </H2>
                        </div>
                        <span className="text-sm text-muted-foreground text-red-600">
                            {/* на {userData?.outPercent}% больше, чем в предыдущем месяце */}
                            {userData?.outPercent > 0 && <span className="text-red-500">на {userData?.outPercent.toFixed(0)}% больше, чем в предыдущем месяце</span>}
                            {userData?.outPercent < 0 && <span className="text-green-500">на {Math.abs(userData?.outPercent).toFixed(0)}% меньше, чем в предыдущем месяце</span>}
                        </span>
                    </Card>
                </div>
                <ClientActions currentBalance={userData?.balance || 0} />
            </div>

            <Card>
                <CardTitle>Вызовы</CardTitle>
                <div className="grid gap-6">
                    {challangesData.map((challange) => (
                        <ChallengeCard key={challange.id} data={challange} />
                    ))}
                </div>
            </Card>
        </div>
    )
}