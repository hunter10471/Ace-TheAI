import Image from "next/image";
import React from "react";

interface ProcessStepProps {
  image: string;
  title: string;
  description: string;
  index: number;
}
const ProcessStep: React.FC<ProcessStepProps> = ({
  title,
  image,
  description,
  index,
}) => {
  return (
    <div className="flex flex-col gap-2 md:gap-4 w-[150px] md:w-[350px] mx-auto">
      <div className="relative w-[80px] md:w-[180px] h-[80px] md:h-[180px]">
        <Image fill src={image} alt="Process Step" className="object-cover" />
      </div>
      <h2 className="text-base md:text-2xl font-bold">
        Step {index}: {title}
      </h2>
      <p className="md:text-base text-xs">{description}</p>
    </div>
  );
};

export default ProcessStep;
