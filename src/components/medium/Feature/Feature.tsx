import { Roboto } from "next/font/google";
import Image from "next/image";
import React from "react";

interface FeatureProps {
	img: string;
	backgroundColor: string;
	heading: string;
	desc: string;
	index: number;
}

const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });

const Feature: React.FC<FeatureProps> = ({
	img,
	backgroundColor,
	heading,
	desc,
	index,
}) => {
	return (
		<div className="px-2 md:px-0 w-full flex md:flex-row flex-col items-center justify-center gap-5 md:gap-20">
			<div
				className={`flex-shrink-0 p-4 w-[350px] sm:w-[400px] h-[250px] sm:h-[300px] bg-gradient-to-t ${backgroundColor} rounded-[25px]`}
			>
				<div className={`relative w-full h-full`}>
					<Image src={img} alt="Feature" fill className="object-contain" />
				</div>
			</div>
			<div className="flex flex-col gap-4">
				<span className="flex items-center justify-center h-8 w-8 font-bold text-xs bg-primary/50 rounded-full text-text/50 dark:text-gray-400">
					{index + 1}
				</span>
				<h2 className={`${roboto.className} text-2xl max-w-[300px] text-text dark:text-gray-100`}>
					{heading}
				</h2>
				<p className="text-text/80 dark:text-gray-400 text-sm max-w-[500px]">{desc}</p>
			</div>
		</div>
	);
};

export default Feature;
