export default async function getUserChallanges(ctx: any) {
    const userChallenges = await ctx.db.userChallenge.findMany({
        include: {
            challenge: true,
        },
        where: {
            userId: ctx.session.user.id
        }
    });

    const groupedChallenges = userChallenges.reduce(
        (acc, userChallenge) => {
            const status = userChallenge.status.toLowerCase();
            if (!acc[status]) {
                acc[status] = [];
            }
            acc[status].push(userChallenge);
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
        where: {
            id: { notIn: userChallenges.map(c => c.challengeId) },
            categoryId: {
                notIn: groupedChallenges.in_progress.map(c => c.challenge.categoryId)
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
            challenge: e
        }))
    }
}