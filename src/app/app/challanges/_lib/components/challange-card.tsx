'use client'
import { Ban, Coffee, Cigarette, MedalIcon, Loader } from "lucide-react"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { calculateProgress } from "../calculate-progress"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"
import { toast } from "sonner"

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

interface ChallengeCardProps {
  data: ChallengeData
  onTakeChallenge?: (id: number) => void
  onRestartChallenge?: (id: number) => void
}

export function ChallengeCard({ data, onTakeChallenge, onRestartChallenge }: ChallengeCardProps) {
  const progress = calculateProgress(data.startDate, data.endDate, data.challenge.durationDays)

  const { mutateAsync: takeChallenge, isPending } = api.challengeUser.takeChallenge.useMutation()
  const { mutateAsync: restartChallenge, isPending: isRestartPending } = api.challengeUser.restartChallenge.useMutation()

  const isLoading = isPending || isRestartPending
  const utils = api.useUtils()

  const restartChallengeHandler = async () => {
    try {
      await restartChallenge({
        id: data.id
      })
      toast.success('Вызов перезапущен')
      utils.challengeUser.getAll.invalidate()
      utils.challengeUser.getAll.refetch()
    } catch (e) {
      console.error(e)
      toast.error('Ошибка перезапуска вызова: ' + e.message)
    }
  }

  const takeChallengeHandler = async () => {
    try {
      await takeChallenge({
        id: data.challenge.id
      })
      toast.success('Вызов взят')
      utils.challengeUser.getAll.invalidate()
      utils.challengeUser.getAll.refetch()
    } catch (e) {
      console.error(e)
      toast.error('Ошибка взятия вызова: ' + e.message)
    }
  }

  const getChallengeIcon = (categoryId: number) => {
    return (
      <MedalIcon />
    )
  }

  const getStatusColor = () => {
    switch (data.status) {
      case "IN_PROGRESS":
        return "bg-[#FFB800]"
      case "COMPLETED":
        return "bg-[#00A83C]"
      case "FAILED":
        return "bg-[#FF3B30]"
      default:
        return "bg-gray-200"
    }
  }

  const getStatusBadge = () => {
    switch (data.status) {
      case "IN_PROGRESS":
        return (
          <Badge variant="secondary" className="bg-[#FFF7E6] text-[#FFB800] hover:bg-[#FFF7E6] whitespace-nowrap">
            в процессе
          </Badge>
        )
      case "COMPLETED":
        return (
          <Badge variant="secondary" className="bg-[#E8F5EC] text-[#00A83C] hover:bg-[#E8F5EC] whitespace-nowrap">
            выполнено
          </Badge>
        )
      case "FAILED":
        return (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-[#FFE5E5] text-[#FF3B30] hover:bg-[#FFE5E5]  whitespace-nowrap">
              провалено
            </Badge>
            <Button
              size={'sm'}
              disabled={isLoading}
              onClick={restartChallengeHandler}
            >
              {isLoading && <Loader className="w-4 h-4 animate-spin" />}
              начать заново
            </Button>
          </div>
        )
      case "NEW":
        return (
          <Button
            disabled={isLoading}
            size={'sm'}
            onClick={takeChallengeHandler}
          >
            {isLoading && <Loader className="w-4 h-4 animate-spin" />}
            взять вызов
          </Button>
        )
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-xl bg-white">
      <div className="flex size-12 items-center justify-center rounded-full bg-gray-100">
        {getChallengeIcon(data.challenge.categoryId)}
      </div>
      <div className="grid flex-1 gap-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className={cn("font-medium mb-0 text-sm", data.status === "NEW" && 'text-primary', data.status === 'COMPLETED' && 'text-green-500', data.status === 'FAILED' && 'text-red-500')}>{data.challenge.name}</h3>
          {getStatusBadge()}
        </div>

        <p className="text-xs text-muted-foreground">
          не покупать товары из категеории "{data.challenge.category.name}" в течении дней: {data.challenge.durationDays}
        </p>
        {data.status !== "NEW" && data.status !== "COMPLETED" && data.status !== "FAILED" && (
          <div className="flex flex-col gap-2">

            <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={`absolute left-0 top-0 h-full transition-all ${getStatusColor()}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

