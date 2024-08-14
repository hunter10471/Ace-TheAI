import clsx from "clsx";
import { Roboto } from "next/font/google";
import React from "react";

interface HeadingProps {
	text: string;
}

const roboto = Roboto({ subsets: ["latin"], weight: ["500"] });

const Heading: React.FC<HeadingProps> = ({ text }) => {
	return (
		<h1 className={clsx(`${roboto.className} font-bold text-[32px]`)}>
			{text}
		</h1>
	);
};

export default Heading;
