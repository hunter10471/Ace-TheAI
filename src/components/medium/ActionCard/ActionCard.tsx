"use client";

import Button from "@/components/small/Button/Button";
import Image from "next/image";
import React from "react";

interface ActionCardProps {
  title: string;
  description: string;
  buttonText: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  buttonText,
  icon,
  onClick,
}) => {
  return (
    <div className="w-[200px] h-[160px]">
      <div className="flex flex-col h-full">
        <div className="flex gap-3 mb-1">
          <h3 className="font-bold text-lg">{title}</h3>
          {icon}
        </div>
        <p className="text-sm text-gray-600 mb-2 flex-grow max-w-[80%]">
          {description}
        </p>
        <Button
          text={buttonText}
          type="primary"
          action={onClick}
          className="w-fit"
          htmlButtonType="button"
        />
      </div>
    </div>
  );
};

export default ActionCard;
