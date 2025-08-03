import React from "react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    color?: "primary" | "white" | "gray";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = "md",
    color = "primary",
}) => {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
    };

    const colorClasses = {
        primary: "border-t-primary",
        white: "border-t-white",
        gray: "border-t-gray-600 dark:border-t-gray-400",
    };

    return (
        <motion.div
            className={`${sizeClasses[size]} border-2 border-gray-200 dark:border-gray-700 rounded-full ${colorClasses[color]}`}
            animate={{ rotate: 360 }}
            transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
            }}
        />
    );
};

export default LoadingSpinner;
