export default async function getUserChallanges(ctx: any) {
    const userChallenges = await ctx.db.userChallenge.findMany({
        include: {
            challenge: {
                include: {
                    category: true
                }
            }
        },
        where: {
            userId: ctx.session.user.id
        }
    });

    const challengesWithSum = await ctx.db.$queryRaw`
    SELECT
        c.id AS "challengeId",
        c.name AS "challengeName",
        c."durationDays",
        SUM(CASE 
            WHEN t."userId" = ${ctx.session.user.id}
                AND t.date >= NOW() - (c."durationDays" * INTERVAL '1 DAY')
                AND t.date <= NOW()
            THEN t.amount 
            ELSE 0 
        END) AS "transactionSum"
    FROM
        "Challenge" c
    JOIN "Category" cat ON c."categoryId" = cat.id
    LEFT JOIN "Transaction" t 
        ON cat.id = t."categoryId"
    GROUP BY
        c.id;
`;


    const groupedChallenges = userChallenges.reduce(
        (acc, userChallenge) => {
            const status = userChallenge.status.toLowerCase();
            if (!acc[status]) {
                acc[status] = [];
            }
            acc[status].push({
                ...userChallenge,
                transactionSum: challengesWithSum.find(c => c.challengeId === userChallenge.challengeId)?.transactionSum || 0
            });
            return acc;
        },
        {
            new: [],
            in_progress: [],
            failed: [],
            completed: []
        }
    );


    const allChallenges = await ctx.db.challenge.findMany({
        orderBy: [
            { categoryId: 'asc' },
            { durationDays: 'asc' }
        ],
        include: {
            category: true
        },
        where: {
            id: { notIn: userChallenges.map(c => c.challengeId) },
            categoryId: {
                notIn:
                    [
                        ...groupedChallenges.in_progress.map(c => c.challenge.categoryId)
                        , ...groupedChallenges.failed.map(c => c.challenge.categoryId)
                    ]
            }
        }
    });

    const newChallanges = Object.values(
        allChallenges.reduce((acc, challenge) => {
            if (!acc[challenge.categoryId]) {
                acc[challenge.categoryId] = challenge;
            }
            return acc;
        }, {})
    );

    return {
        ...groupedChallenges,
        new: newChallanges.map(e => ({
            id: Math.floor(Math.random() * 1000000),
            status: "NEW",
            transactionSum: challengesWithSum.find(c => c.challengeId === e.id)?.transactionSum || 0,
            challenge: e
        }))
    }
}