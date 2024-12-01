import { TRPCReactProvider } from "~/trpc/react"
import { ReduxProvider } from "./_lib/context/redux"
import { Metadata } from "next"
import { Montserrat } from 'next/font/google';
import "~/styles/globals.css";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const montserrat = Montserrat({ subsets: ['latin'] });

export default async function LkLayout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="ru" className={`${montserrat.className} `}>
            <head>
                <title>
                    Финик - ваш финансовый учет
                </title>
                <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" data-meta-dynamic="true"></meta>
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/android-chrome-192x192.png" />
                <meta name="theme-color" content="#fafafa" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>
            </head>
            <body className="bg-background text-foreground">
                <TRPCReactProvider>
                    <ReduxProvider>
                        {children}
                        <Toaster />
                    </ReduxProvider>
                </TRPCReactProvider>
            </body>
        </html >
    )
}