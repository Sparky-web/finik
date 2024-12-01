"use client"
import { ArrowRightLeft, CoinsIcon, Pencil, Wallet } from "lucide-react";
import Card, { CardTitle } from "~/app/_lib/components/card";
import { Button } from "~/components/ui/button";
import { H2 } from "~/components/ui/typography";
import { AccountModificationDialog } from "../transactions/_lib/components/edit-account-dialog";
import { TransferDialog } from "../transactions/_lib/components/transfer-dialog";

export default function Accounts() {
    return (
        <div className="grid gap-6">
            <H2>Управление счетами</H2>
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <div className="grid gap-2">
                        <CardTitle className="flex items-center content-center gap-3">
                            <Wallet />
                            Основной счет
                        </CardTitle>
                        <H2>10 000 ₽</H2>
                    </div>

                    <AccountModificationDialog type="default" currentBalance={10000} onSave={() => { }}
                        triggerButton={
                            (props) => (
                                <Button size="xs" variant={'tenary'} className="max-w-fit" {...props}>
                                    <Pencil className="w-4 h-4" />
                                    Изменить баланс
                                </Button>
                            )
                        }
                    />
                </Card>
                <Card>
                    <div className="grid gap-2">

                        <CardTitle className="flex items-center content-center gap-3">
                            <CoinsIcon />
                            Накопительный счет
                        </CardTitle>
                        <H2>10 000 ₽</H2>
                    </div>
                    <AccountModificationDialog type="savings" currentBalance={10000} onSave={() => { }}
                        triggerButton={
                            (props) => (
                                <Button size="xs" variant={'tenary'} className="max-w-fit" {...props}>
                                    <Pencil className="w-4 h-4" />
                                    Изменить баланс
                                </Button>
                            )
                        }
                    />
                </Card>
            </div>

            <TransferDialog onTransfer={() => { }} triggerButton={(props) => (
                <Button size="sm" variant={'default'} className="max-w-fit"
                    {...props}
                >
                        <ArrowRightLeft className="w-4 h-4" />
                    Перевести между счетами
                </Button>
            )} />
        </div>
    )
}