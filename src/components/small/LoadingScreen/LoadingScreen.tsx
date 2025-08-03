"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface LoadingScreenProps {
    message?: string;
    showLogo?: boolean;
    size?: "small" | "medium" | "large";
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
    message = "Loading...",
    showLogo = true,
    size = "medium",
}) => {
    const sizeClasses = {
        small: "w-8 h-8",
        medium: "w-12 h-12",
        large: "w-16 h-16",
    };

    const logoSize = {
        small: 40,
        medium: 60,
        large: 80,
    };

    return (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center z-50">
            <div className="flex flex-col items-center space-y-6">
                {showLogo && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-4"
                    >
                        <Image
                            src="/assets/logo_primary.png"
                            alt="Ace The AI"
                            width={logoSize[size]}
                            height={logoSize[size]}
                            className="dark:hidden"
                        />
                        <Image
                            src="/assets/logo_light.png"
                            alt="Ace The AI"
                            width={logoSize[size]}
                            height={logoSize[size]}
                            className="hidden dark:block"
                        />
                    </motion.div>
                )}

                <div className="flex flex-col items-center space-y-4">
                    <motion.div
                        className={`${sizeClasses[size]} relative`}
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full"></div>
                    </motion.div>

                    {message && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="text-gray-600 dark:text-gray-400 text-sm font-medium"
                        >
                            {message}
                        </motion.p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
