"use client";
import clsx from "clsx";
import { Roboto } from "next/font/google";
import React from "react";
import { Oval } from "react-loader-spinner";

interface ButtonProps {
  text: string;
  type: "primary" | "outline" | "black-outline" | "text";
  htmlButtonType: "submit" | "reset" | "button";
  action?: () => void;
  className?: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const roboto = Roboto({ subsets: ["latin"], weight: ["500"] });

const Button: React.FC<ButtonProps> = ({
  text,
  type,
  action,
  className,
  htmlButtonType,
  isLoading,
  icon
}) => {
  return (
    <button
      onClick={action}
      type={htmlButtonType}
      disabled={isLoading}
      className={clsx(
        `lg:px-6 px-4 py-2 min-w-[100px] text-sm transition-all rounded-md border hover:shadow-md ${className} ${roboto.className}`,
        {
          "bg-primary text-secondary hover:bg-primaryDark hover:border-primaryDark border-primary":
            type === "primary",
          "text-primary border-primary hover:text-primaryDark hover:border-primaryDark bg-transparent":
            type === "outline",
          "border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100": 
            type === "text",
          "border-text dark:border-gray-300 text-text dark:text-gray-300 hover:border-gray-600 dark:hover:border-gray-400 bg-transparent":
            type === "black-outline",
          "flex items-center justify-center": isLoading,
        }
      )}
    >
      {!isLoading && icon}
      {isLoading ? <Oval color="#ff6f61" secondaryColor="#fff" strokeWidth={5} height={20} width={20} /> : text}
    </button>
  );
};

export default Button;
