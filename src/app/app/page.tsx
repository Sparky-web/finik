// import { api } from "~/trpc/server"

import { auth } from "~/server/auth"

export default async function Page() {
    const user = await auth()

    return (
        <div>
            <h1>{user?.user?.name} hello</h1>
        </div>
    )
}