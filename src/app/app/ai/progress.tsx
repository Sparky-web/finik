import React from 'react'

interface CircularProgressProps {
  size?: number
  strokeWidth?: number
  percentage: number
  color?: string
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 50,
  strokeWidth = 4,
  percentage,
  color = 'currentColor'
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
      <circle
        className="text-gray-300"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className="text-primary transition-all duration-300 ease-in-out"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        stroke={color}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        className="font-semibold text-sm fill-current"
      >
        {`${Math.round(percentage)}%`}
      </text>
    </svg>
  )
}