"use client"

import { ReactNode } from "react"

interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContainerProps {
  config: ChartConfig
  children: ReactNode
  className?: string
}

export function ChartContainer({ config, children, className = "" }: ChartContainerProps) {
  return (
    <div className={className}>
      <style jsx>{`
        :global([data-recharts-component]) {
          --color-rating: ${config.rating?.color || "hsl(0, 84%, 60%)"};
        }
      `}</style>
      {children}
    </div>
  )
}

interface ChartTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  content?: (props: { active?: boolean; payload?: any[]; label?: string }) => ReactNode
  cursor?: boolean | any
}

export function ChartTooltip({ content, ...props }: ChartTooltipProps) {
  if (!content) return null
  return content(props)
} 