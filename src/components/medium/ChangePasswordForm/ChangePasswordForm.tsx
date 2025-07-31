"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useThemeStore } from "@/lib/store"
import Input from "@/components/small/Input/Input"
import Button from "@/components/small/Button/Button"

export default function ChangePasswordForm() {
  const { isDarkMode } = useThemeStore()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Password change submitted:", formData)
  }

  const titleColor = isDarkMode ? "text-gray-100" : "text-gray-900"

  return (
    <div className={`w-full`}>
      <h2 className={`text-lg font-semibold ${titleColor} mb-6`}>Change Password</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Current Password
          </label>
          <div className="relative">
            <Input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Enter your current password"
              value={formData.currentPassword}
              onChange={(e) => handleInputChange("currentPassword", e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            New Password
          </label>
          <div className="relative">
            <Input
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter your new password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Confirm New Password
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter your new password again"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button htmlButtonType="submit" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90">
            Save
          </Button>
        </div>
      </form>
    </div>
  )
} 