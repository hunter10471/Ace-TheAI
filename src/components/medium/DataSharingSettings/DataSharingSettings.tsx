"use client"

import { useState } from "react"
import { useThemeStore } from "@/lib/store"

export default function DataSharingSettings() {
  const { isDarkMode } = useThemeStore()
  const [shareWithThirdParties, setShareWithThirdParties] = useState(false)
  const [useForResearch, setUseForResearch] = useState(true)

  const titleColor = isDarkMode ? "text-gray-100" : "text-gray-900"
  const textColor = isDarkMode ? "text-gray-300" : "text-gray-700"

  const ToggleSwitch = ({ 
    checked, 
    onChange, 
    label 
  }: { 
    checked: boolean; 
    onChange: (checked: boolean) => void; 
    label: string; 
  }) => (
    <div className="flex items-center justify-between py-3">
      <span className={`text-sm ${textColor}`}>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          checked ? 'bg-primary' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )

  return (
    <div className={`w-full`}>
      <h2 className={`text-lg font-semibold ${titleColor} mb-6`}>Data Sharing</h2>
        <ToggleSwitch
          checked={shareWithThirdParties}
          onChange={setShareWithThirdParties}
          label="Share data with third parties"
        />
        <ToggleSwitch
          checked={useForResearch}
          onChange={setUseForResearch}
          label="Use data for research"
        />
    </div>
  )
} 