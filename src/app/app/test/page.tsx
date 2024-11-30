'use client'

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
import { H1, H4 } from "~/components/ui/typography"
import { api } from "~/trpc/react"

export default function Page() {
    const [data, setData] = useState<string>('')

    const { mutateAsync, data: res, isPending } = api.transaction.create.useMutation({
        onError: (e) => {
            console.error(e)
            toast.error(e.message)
        }
    })

    const { data: res1, error: error1 } = api.user.getAll.useQuery(undefined, {
    })

    const { data: res2, error: error2 } = api.user.getbyId.useQuery("cm43ywll10006d3egdxdzwqhm")

    useEffect(() => {
        if(error1) {
            console.error(error1)
            toast.error('Ошибка запроса без параметров: ' + error1.message)
        }
    }, [error1])

    useEffect(() => {
        if(error2) {
            console.error(error2)
            toast.error('Ошибка запроса с параметром: ' + error2.message)
        }
    }, [error2])

    return (
        <div className="py-6 grid gap-6">
            <H1>
                Страница отладки
            </H1>
            
            <textarea rows="10" name="data" value={data} onChange={e => setData(e.target.value)} />
            <Button onClick={() => mutateAsync(JSON.parse(data))}>
                Отправить
            </Button>

            {isPending && <div>loading...</div>}

            <div className="grid gap-1">
                <H4>mutation</H4>
                {res && <pre>{JSON.stringify(res, null, 2)}</pre>}
            </div>

            <div className="grid gap-1">
                <H4>get without params</H4>
                {res1 && <pre>{JSON.stringify(res1, null, 2)}</pre>}
            </div>

            <div className="grid gap-1">
                <H4>get with params</H4>
                {res2 && <pre>{JSON.stringify(res2, null, 2)}</pre>}
            </div>
        </div>
    )
}