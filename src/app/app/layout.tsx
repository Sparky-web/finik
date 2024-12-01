import { redirect } from "next/navigation"
// import session from "~/lib/session"
import SetUserProvider from "./_lib/providers/set-user"
import Menu from "../_lib/components/menu"
import InstallProvider from "./_lib/providers/install"
import { auth } from "~/server/auth"
import "~/styles/globals.css";


export default async function LkLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()

    const user = session?.user || null

    if(!user) return redirect('/auth/signin')

    return (
        <div className="max-lg:container max-lg:pt-6 max-lg:pb-[calc(16px+120px)] lg:grid lg:grid-cols-[250px,1fr] lg:h-screen min-h-screen grid">
            <SetUserProvider userData={user}>
                <InstallProvider>
                    <Menu />
                    {/* <Suspense fallback="loading..."> */}
                    <div className="lg:h-full lg:overflow-y-auto lg:py-8 lg:px-10 lg:relative">
                        {children}
                    </div>
                    {/* </Suspense> */}
                </InstallProvider>
            </SetUserProvider>
        </div>
    )
}