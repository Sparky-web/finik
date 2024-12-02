"use client"
// import { H2, P } from "~/components/ui/typography";

// export default function AI() {
//     return (
//         <div className="grid gap-6">
//             <H2>AI помощник</H2>
//             <P>

//             </P>
//         </div>
//     )
// }

'use client'

import { useState, useEffect } from 'react'
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { TrendingUp, Brain, Dna, ArrowRight, X, Wand2, Loader } from 'lucide-react'
import { Progress } from "~/components/ui/progress"
import { H2, H3, P } from '~/components/ui/typography'

const aiTips = [
    {
        title: "Узнать тренды расходов",
        name: "Ваши тренды расходов",
        description: "Анализ ваших финансовых потоков для выявления ключевых паттернов",
        icon: TrendingUp,
        color: "from-emerald-700 to-cyan-700",
        analysis: "Ваши основные расходы: Еда (30%), Жилье (25%), Транспорт (15%). Рекомендуем оптимизировать расходы на еду, используя оптовые закупки и планирование меню."
    },
    {
        title: "Получить финансовый совет",
        name: "Ваш финансовый совет",
        description: "Персонализированные рекомендации для улучшения финансового здоровья",
        icon: Brain,
        color: "from-purple-700 to-pink-700",
        analysis: "Увеличьте ваши сбережения на 5% ежемесячно. Рассмотрите возможность инвестирования в индексные фонды для долгосрочного роста капитала."
    },
    {
        title: "Узнать финансовый ДНК",
        name: "Ваш финансовый ДНК",
        description: "Глубокий анализ вашего финансового поведения и стратегий",
        icon: Dna,
        color: "from-amber-700 to-orange-700", 
        analysis: `Импульсивность: 70%Частые мелкие траты на развлечения и фастфуд указывают на склонность к импульсивным покупкам.

Рациональность: 60%Регулярные крупные траты на подписки и косметику снижают уровень рациональности.

Планирование: 40%Отсутствие четкого распределения бюджета и частые незапланированные траты говорят о слабом планировании.`
    }
]

export default function AITipsPage() {
    const [flippedCard, setFlippedCard] = useState(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (isAnalyzing) {
            const timer = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress === 100) {
                        clearInterval(timer)
                        setIsAnalyzing(false)
                        return 100
                    }
                    return oldProgress + 2
                })
            }, 50)
            return () => clearInterval(timer)
        }
    }, [isAnalyzing])

    const startAnalysis = (index) => {
        setFlippedCard(index)
        setIsAnalyzing(true)
        setProgress(0)
    }


    return (
        <div className="grid gap-6">
            <H2>AI помощник</H2>
            <P>
                Страница с ИИ-подсказками предназначена для упрощения управления личными финансами. Она анализирует данные о ваших транзакциях, предлагает полезные инсайты и помогает лучше понять свои финансовые привычки, предоставляя рекомендации для оптимизации расходов и повышения эффективности планирования бюджета.
            </P>
            <div className="grid gap-6 lg:grid-cols-3">
                {aiTips.map((tip, index) => <AICard key={tip.title} tip={tip} index={index} startAnalysis={startAnalysis} />)}
            </div>

        </div>
    )
}


const AICard = ({ tip, index, startAnalysis }: any) => {
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const load = async () => {
        setIsLoading(true)
        try {
            await new Promise(r => setTimeout(r, 2000))
            setData(tip.analysis)
        }
        catch (error) {
            console.log(error)
        }
        setIsLoading(false)
    }

    return (<Card
        key={tip.title}
        className={`overflow-hidden relative group cursor-pointer transition-all duration-300 ease-in-out animate-fadeInUp`}
        style={{ animationDelay: `${index * 100}ms` }}
        onClick={() => load()}
    >
        <div className={`absolute inset-0 bg-gradient-to-br ${tip.color} opacity-85 transition-opacity group-hover:opacity-100`} />
        <CardContent className="relative  p-6 grid grid-rows-[50px,auto,60px] items-start h-full gap-4 text-white">
            {!data && (
                <>
                    <tip.icon className="w-10 h-10 mb-4 text-white transition-transform" />
                    <h2 className="text-2xl font-bold text-left">{tip.title}</h2>
                    {/* <p className="text-lg text-center">{tip.description}</p> */}
                    <Button
                        className="w-full mt-auto bg-white text-gray-900 hover:bg-white hover:text-gray-900"
                        size="lg"
                    >
                        {isLoading ? (
                            <>
                                <Loader className="h-4 w-4 animate-spin" />
                                Загрузка...
                            </>) : <>
                            <Wand2 className="h-6 w-6 mr-2 text-purple-400" />
                            Получить подсказку
                        </>}
                    </Button>
                </>
            )}

            {data &&
                <>
                    <H3 className='flex items-center text-white gap-4'>
                        <Wand2 />
                        {tip.name}:
                    </H3>
                    <P className='font-medium whitespace-pre-wrap'>
                        {data}
                    </P>
                </>
            }
        </CardContent>
    </Card>)
}