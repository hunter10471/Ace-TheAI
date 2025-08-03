import React from "react";
import { motion } from "framer-motion";

interface LoadingSkeletonProps {
    type?: "text" | "card" | "avatar" | "button";
    lines?: number;
    className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
    type = "text",
    lines = 1,
    className = "",
}) => {
    const skeletonVariants = {
        animate: {
            opacity: [0.5, 1, 0.5],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    const renderSkeleton = () => {
        switch (type) {
            case "text":
                return (
                    <div className={`space-y-2 ${className}`}>
                        {Array.from({ length: lines }).map((_, index) => (
                            <motion.div
                                key={index}
                                className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
                                style={{
                                    width: `${Math.random() * 40 + 60}%`,
                                }}
                                variants={skeletonVariants}
                                animate="animate"
                            />
                        ))}
                    </div>
                );

            case "card":
                return (
                    <motion.div
                        className={`bg-gray-200 dark:bg-gray-700 rounded-lg p-4 ${className}`}
                        variants={skeletonVariants}
                        animate="animate"
                    >
                        <div className="space-y-3">
                            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
                            </div>
                        </div>
                    </motion.div>
                );

            case "avatar":
                return (
                    <motion.div
                        className={`w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full ${className}`}
                        variants={skeletonVariants}
                        animate="animate"
                    />
                );

            case "button":
                return (
                    <motion.div
                        className={`h-10 bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`}
                        variants={skeletonVariants}
                        animate="animate"
                    />
                );

            default:
                return null;
        }
    };

    return renderSkeleton();
};

export default LoadingSkeleton;
