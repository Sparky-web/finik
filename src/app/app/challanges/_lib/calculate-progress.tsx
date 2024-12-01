export function calculateProgress(
    startDate: string | null,
    endDate: string | null,
    durationDays: number
  ): number {
    if (!startDate) return 0
    
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    const progress = Math.min(
      ((end.getTime() - start.getTime()) / (durationDays * 24 * 60 * 60 * 1000)) * 100,
      100
    )
    
    return Math.max(0, Math.round(progress))
  }
  
  