"use client";
import clsx from "clsx";
import { Roboto } from "next/font/google";
import React from "react";

interface ButtonProps {
  text: string;
  type: "primary" | "outline" | "black-outline" | "text";
  htmlButtonType: "submit" | "reset" | "button";
  action?: () => void;
  className?: string;
}

const roboto = Roboto({ subsets: ["latin"], weight: ["500"] });

const Button: React.FC<ButtonProps> = ({
  text,
  type,
  action,
  className,
  htmlButtonType,
}) => {
  return (
    <button
      onClick={action}
      type={htmlButtonType}
      className={clsx(
        `lg:px-6 px-4 py-2 min-w-[100px] text-sm transition-all rounded-md border hover:shadow-md ${className} ${roboto.className}`,
        {
          "bg-primary text-secondary hover:bg-primaryDark hover:border-primaryDark border-primary":
            type === "primary",
          "text-primary border-primary hover:text-primaryDark hover:border-primaryDark ":
            type === "outline",
          "border-transparent": type === "text",
          " border-text": type === "black-outline",
        }
      )}
    >
      {text}
    </button>
  );
};

export default Button;
