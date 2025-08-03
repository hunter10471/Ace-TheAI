"use client";

import { useState, useRef, useEffect } from "react";

interface TooltipProps {
    term: string;
    definition: string;
    children: React.ReactNode;
}

export default function Tooltip({ term, definition, children }: TooltipProps) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLSpanElement>(null);

    const handleMouseEnter = (e: React.MouseEvent) => {
        setShowTooltip(true);

        // Calculate position for the tooltip
        const rect = e.currentTarget.getBoundingClientRect();
        const tooltipWidth = 320; // max-w-xs = 320px
        const tooltipHeight = 100; // estimated height

        let left = rect.left + rect.width / 2 - tooltipWidth / 2;
        let top = rect.top - tooltipHeight - 8; // 8px gap

        // Ensure tooltip doesn't go off-screen
        if (left < 8) left = 8;
        if (left + tooltipWidth > window.innerWidth - 8) {
            left = window.innerWidth - tooltipWidth - 8;
        }

        // If tooltip would go above viewport, show it below instead
        if (top < 8) {
            top = rect.bottom + 8;
        }

        setTooltipPosition({ top, left });
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    return (
        <span className="relative inline-block">
            <span
                ref={triggerRef}
                className="text-primary font-medium cursor-help border-b border-dashed border-primary"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </span>

            {showTooltip && (
                <div
                    className="fixed z-[9999] px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl max-w-xs"
                    style={{
                        top: `${tooltipPosition.top}px`,
                        left: `${tooltipPosition.left}px`,
                    }}
                >
                    <div className="font-semibold mb-1">{term}</div>
                    <div className="text-gray-200 leading-relaxed">
                        {definition}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
            )}
        </span>
    );
}
