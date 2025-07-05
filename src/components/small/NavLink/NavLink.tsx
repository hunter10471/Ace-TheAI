"use client";
import { Roboto } from "next/font/google";
import Link from "next/link";
import React from "react";

interface NavLinkProps {
	route: string;
	name: string;
	isNavMenu?: boolean;
}

const roboto = Roboto({ subsets: ["latin"], weight: ["500"] });

const NavLink: React.FC<NavLinkProps> = ({ route, name, isNavMenu }) => {
	return (
		<Link
			href={route}
			className={`capitalize hover:border-primary border-transparent border-b-2 transition-all px-2 lg:px-6 py-[2px] ${
				isNavMenu ? "text-secondary dark:text-gray-200" : "text-text dark:text-gray-200"
			} ${roboto.className}`}
		>
			{name}
		</Link>
	);
};

export default NavLink;
