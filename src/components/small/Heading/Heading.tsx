import clsx from "clsx";
import { Roboto } from "next/font/google";
import React from "react";

interface HeadingProps {
    text: string;
    preTitle?: string;
    className?: string;
}

const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });

const Heading: React.FC<HeadingProps> = ({ text, preTitle, className }) => {
    return (
        <div className={`flex flex-col items-center gap-2 ${className}`}>
            {preTitle && (
                <h3 className="text-primary uppercase font-bold text-[10px] md:text-[14px]">
                    {preTitle}
                </h3>
            )}
            <h1
                className={clsx(
                    `${roboto.className} font-bold leading-tight text-[24px] md:text-[32px] text-text dark:text-gray-100`
                )}
            >
                {text}
            </h1>
        </div>
    );
};

export default Heading;
