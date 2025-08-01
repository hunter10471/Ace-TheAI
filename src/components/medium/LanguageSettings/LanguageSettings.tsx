"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useThemeStore } from "@/lib/store";

const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
];

export default function LanguageSettings() {
    const { isDarkMode } = useThemeStore();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(
        null
    );
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const titleColor = isDarkMode ? "text-gray-100" : "text-gray-900";
    const textColor = isDarkMode ? "text-gray-300" : "text-gray-700";
    const borderColor = isDarkMode ? "border-gray-600" : "border-gray-200";
    const dropdownBgColor = isDarkMode ? "bg-gray-700" : "bg-white";
    const hoverColor = isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-50";

    const selectedLanguageName = selectedLanguage
        ? languages.find(lang => lang.code === selectedLanguage)?.name
        : null;

    return (
        <div className={`w-full`}>
            <h2 className={`text-lg font-semibold ${titleColor} mb-6`}>
                Language
            </h2>

            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between p-3 border ${borderColor} rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                >
                    <span
                        className={
                            selectedLanguageName ? textColor : "text-gray-500"
                        }
                    >
                        {selectedLanguageName || "Select a language"}
                    </span>
                    <ChevronDown
                        size={16}
                        className={`text-gray-500 transition-transform ${
                            isOpen ? "rotate-180" : ""
                        }`}
                    />
                </button>

                {isOpen && (
                    <div
                        className={`absolute z-10 w-full mt-1 border ${borderColor} rounded-md shadow-lg ${dropdownBgColor}`}
                    >
                        <div className="py-1">
                            {languages.map(language => (
                                <button
                                    key={language.code}
                                    type="button"
                                    onClick={() => {
                                        setSelectedLanguage(language.code);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full px-3 py-2 text-left text-sm ${textColor} ${hoverColor} transition-colors`}
                                >
                                    {language.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
