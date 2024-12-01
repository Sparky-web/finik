// import { api } from "~/trpc/server"

import { redirect } from "next/navigation"
import { auth } from "~/server/auth"

export default async function Page() {
    const user = await auth()
    return redirect('/app/summary')

    return (
        <div>
            <h1>{user?.user?.name} hello</h1>
        </div>
    )
}