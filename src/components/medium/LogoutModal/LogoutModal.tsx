"use client"

import React, { useEffect, useRef, useState } from "react"
import { IoMdClose } from "react-icons/io"
import { useThemeStore } from "@/lib/store"
import Button from "@/components/small/Button/Button"

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  const { isDarkMode } = useThemeStore()
  const modalRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        !isLoading &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose, isOpen, isLoading])

  const bgColor = isDarkMode ? "bg-gray-800" : "bg-white"
  const titleColor = isDarkMode ? "text-gray-100" : "text-gray-900"
  const textColor = isDarkMode ? "text-gray-300" : "text-gray-700"

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
    } finally {
      setIsLoading(false)
    }
  }

  const modalBody = (
    <div className="p-6">
      <h2 className={`text-xl font-semibold ${titleColor} mb-4`}>Logout</h2>
      <p className={`text-sm ${textColor} mb-6`}>
        Are you sure you want to logout?
      </p>
      
      <div className="flex gap-3 justify-end">
        <Button
          type="outline"
          htmlButtonType="button"
          action={onClose}
          className="px-4 py-2"
        >
          Cancel
        </Button>
        <Button
          type="primary"
          htmlButtonType="button"
          action={handleConfirm}
          className="px-4 py-2 bg-primary text-white hover:bg-primary/90"
          isLoading={isLoading}
        >
          {isLoading ? "Logging out..." : "Log out"}
        </Button>
      </div>
    </div>
  )

  return (
    <div
      className={`fixed overflow-hidden top-0 left-0 z-[999] transition-all duration-500 ${
        isOpen 
          ? "bg-opacity-50 dark:bg-opacity-70 backdrop-blur-sm bg-black/50 dark:bg-gray-900/50" 
          : "bg-opacity-0 dark:bg-opacity-0 pointer-events-none"
      } w-screen h-screen`}
    >
      <div
        className={`absolute transition-all duration-500 ease-in-out w-[370px] sm:w-[400px] h-fit mx-auto my-auto left-0 right-0 top-0 bottom-0 ${
          isOpen
            ? "translate-y-[0vh] opacity-100"
            : "translate-y-[100vh] opacity-0"
        } ${bgColor} rounded-xl shadow-lg`}
        ref={modalRef}
      >
        <button 
          onClick={onClose} 
          className="absolute right-3 top-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          disabled={isLoading}
        >
          <IoMdClose size={20} />
        </button>
        {modalBody}
      </div>
    </div>
  )
} 