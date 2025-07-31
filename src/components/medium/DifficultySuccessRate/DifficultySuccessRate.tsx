"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { useThemeStore } from "@/lib/store"

const data = [
  { name: "Novice", value: 65, color: "#86EFAC" },
  { name: "Advanced", value: 30, color: "#C4B5FD" },
  { name: "Hard", value: 15, color: "#FDA4AF" },
]

const chartConfig = {
  novice: {
    label: "Novice",
    color: "#86EFAC",
  },
  advanced: {
    label: "Advanced",
    color: "#C4B5FD",
  },
  hard: {
    label: "Hard",
    color: "#FDA4AF",
  },
}

const CustomLegend = ({ payload, isDarkMode }: any) => {
  return (
    <div className="flex flex-col gap-3 ml-8">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {entry.value} {entry.payload.value}%
          </span>
        </div>
      ))}
    </div>
  )
}

const CenterLabel = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>75%</div>
        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Average Rate</div>
      </div>
    </div>
  )
}

export default function DifficultySuccessRateChart() {
  const { isDarkMode } = useThemeStore()
  
  const titleColor = isDarkMode ? "text-gray-100" : "text-gray-900"

  return (
    <div className={`w-full max-w-[350px] rounded-lg`}>
      <h2 className={`text-lg font-semibold ${titleColor} mb-6`}>Difficulty Success Rate</h2>
      <div className="flex items-center justify-between">
        <div className="relative">
          <ChartContainer config={chartConfig} className="h-[250px] w-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <CenterLabel isDarkMode={isDarkMode} />
        </div>
        <CustomLegend
          isDarkMode={isDarkMode}
          payload={data.map((item) => ({
            value: item.name,
            color: item.color,
            payload: { value: item.value },
          }))}
        />
      </div>
    </div>
  )
}
