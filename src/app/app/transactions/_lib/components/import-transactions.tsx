'use client';
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Dropzone from '~/app/_lib/components/dropzone'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { H4, P } from '~/components/ui/typography'
import Image from 'next/image'
import Tinka from "../images/tinka.png"
import parseTransactions, { ParsedTransaction } from '../utils/parse-transactions'
import { Button } from '~/components/ui/button'
import { api } from '~/trpc/react'
import { toast } from 'sonner';
import { Loader } from 'lucide-react';

export default function ImportTransactionsDialog({ open, onOpenChange }: any) {
    const [file, setFile] = useState<File | null>(null)

    const [result, setResult] = useState<ParsedTransaction[] | null>(null)

    const { mutateAsync: importTransactions, isPending } = api.transaction.import.useMutation()

    useEffect(() => {
        if (file) {
            parseTransactions(file).then(data => {
                setResult(data)
            })
        }
    }, [file])

    const utils = api.useUtils()

    const handleImport = async () => {
        try {
            const { imported } = await importTransactions(result)
            toast.success(`Импортировано ${imported} транзакций`)
            utils.transaction.get.invalidate()
            utils.transaction.get.refetch()
            onOpenChange(false)
        } catch (e) {
            console.error(e)
            toast.error('Ошибка импорта транзакций: ' + e.message)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-4xl'>
                <DialogHeader>
                    <DialogTitle>Импорт транзакций из Тинькофф</DialogTitle>
                    {/* <DialogDescription>

                    </DialogDescription> */}
                </DialogHeader>

                <div className="grid gap-6 max-w-full">
                    <div className="grid gap-1.5">
                        <H4>1. Перейдите на страницу операций в Тинькофф</H4>
                        <P><Link className='text-primary text-sm' href={'https://www.tbank.ru/events/feed/'} target="_blank" rel="noreferrer">
                            https://www.tbank.ru/events/feed/</Link>
                        </P>
                    </div>
                    <div className="grid gap-1.5">
                        <H4>2. Скачайте транзакции в формате CSV</H4>
                        <P className='text-muted-foreground text-sm'>Выберите период: за все время. Сначала скачайте расходы, затем доходы.</P>
                        <Image src={Tinka} alt="Tinka" width={400} height={200} objectFit='contain' className='w-full h-auto mt-2' />
                    </div>

                    <div className="grid gap-1.5">
                        <H4>3. Загрузите CSV файл в приложение</H4>
                        <Dropzone files={file} setFiles={setFile} />
                    </div>

                    {result && <div className="grid gap-1.5">
                        <H4>4. Загрузите транзакции</H4>
                        <P>Найдено {result.length} транзакций</P>
                        <Button onClick={() => {
                            handleImport()
                        }}
                            disabled={isPending}
                            className='mt-3'
                        >
                            {isPending && <Loader className="h-4 w-4 animate-spin" />}
                            Загрузить
                        </Button>
                    </div>}
                </div>
            </DialogContent>
        </Dialog>
    )
}
