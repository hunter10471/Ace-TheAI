"use client";

import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { skills } from "@/lib/data";

interface SkillsSelectorProps {
    selectedSkills: string[];
    onSkillsChange: (skills: string[]) => void;
    maxSkills?: number;
}

const SkillsSelector: React.FC<SkillsSelectorProps> = ({
    selectedSkills,
    onSkillsChange,
    maxSkills = 5,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [filteredSkills, setFilteredSkills] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredSkills([]);
            setIsDropdownOpen(false);
        } else {
            const filtered = skills.filter(
                skill =>
                    skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    !selectedSkills.includes(skill)
            );
            setFilteredSkills(filtered.slice(0, 10));
            setIsDropdownOpen(filtered.length > 0);
        }
    }, [searchTerm, selectedSkills]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleAddSkill = (skill: string) => {
        if (
            selectedSkills.length < maxSkills &&
            !selectedSkills.includes(skill)
        ) {
            onSkillsChange([...selectedSkills, skill]);
            setSearchTerm("");
            setIsDropdownOpen(false);
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        onSkillsChange(selectedSkills.filter(skill => skill !== skillToRemove));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && filteredSkills.length > 0) {
            e.preventDefault();
            handleAddSkill(filteredSkills[0]);
        }
    };

    return (
        <div className="relative">
            <div className="mb-3">
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedSkills.map(skill => (
                        <div
                            key={skill}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-gray-500"
                        >
                            <span>{skill}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveSkill(skill)}
                                className="ml-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                            >
                                <IoClose size={14} />
                            </button>
                        </div>
                    ))}
                </div>
                {selectedSkills.length < maxSkills && (
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchTerm}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder={`Search and choose up to ${maxSkills} skills`}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        {isDropdownOpen && (
                            <div
                                ref={dropdownRef}
                                className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto"
                            >
                                {filteredSkills.map(skill => (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => handleAddSkill(skill)}
                                        className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 transition-colors"
                                    >
                                        {skill}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
                {selectedSkills.length}/{maxSkills} skills selected
            </div>
        </div>
    );
};

export default SkillsSelector;
