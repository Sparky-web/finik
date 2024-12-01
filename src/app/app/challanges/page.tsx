"use client"
import { useState } from "react"
import { ChallengeCard } from "./_lib/components/challange-card"
import { api } from "~/trpc/react"
import { H2 } from "~/components/ui/typography"
import Card, { CardTitle } from "~/app/_lib/components/card"

interface Challenge {
    id: number
    name: string
    categoryId: number
    durationDays: number
}

interface ChallengeData {
    id: number
    userId: string
    challengeId: number
    status: "NEW" | "IN_PROGRESS" | "COMPLETED" | "FAILED"
    startDate: string | null
    endDate: string | null
    challenge: Challenge
}

interface ChallengesData {
    new: ChallengeData[]
    in_progress: ChallengeData[]
    failed: ChallengeData[]
    completed: ChallengeData[]
}

export default function ChallengesPage() {
    const { data: challenges } = api.challengeUser.getAll.useQuery()

    if (!challenges) return <div>Loading...</div>

    const handleTakeChallenge = (id: number) => {
        // Handle taking new challenge
        console.log('Taking challenge:', id)
    }

    const handleRestartChallenge = (id: number) => {
        // Handle restarting failed challenge
        console.log('Restarting challenge:', id)
    }

    return (
        <div className="flex flex-col gap-6">
            <H2>Вызовы</H2>
            {challenges.in_progress.length > 0 && (
                <Card>
                    <CardTitle >В процессе</CardTitle>
                    <div className="flex flex-col gap-4">
                        {challenges.in_progress.map((challenge) => (
                            <ChallengeCard
                                key={challenge.id}
                                data={challenge}
                            />
                        ))}
                    </div>
                </Card>
            )}

            {challenges.new.length > 0 && (
                <Card>
                    <CardTitle>Новые</CardTitle>
                    <div className="flex flex-col gap-4">
                        {challenges.new.map((challenge) => (
                            <ChallengeCard
                                key={challenge.id}
                                data={challenge}
                                onTakeChallenge={handleTakeChallenge}
                            />
                        ))}
                    </div>
                </Card>
            )}

            {challenges.completed.length > 0 && (
                <Card>
                    <CardTitle>Выполненные</CardTitle>
                    <div className="flex flex-col gap-4">
                        {challenges.completed.map((challenge) => (
                            <ChallengeCard
                                key={challenge.id}
                                data={challenge}
                            />
                        ))}
                    </div>
                </Card>
            )}

            {challenges.failed.length > 0 && (
                <Card>
                    <CardTitle>Проваленные</CardTitle>
                    <div className="flex flex-col gap-4">
                        {challenges.failed.map((challenge) => (
                            <ChallengeCard
                                key={challenge.id}
                                data={challenge}
                                onRestartChallenge={handleRestartChallenge}
                            />
                        ))}
                    </div>
                </Card>
            )}
        </div>
    )
}

