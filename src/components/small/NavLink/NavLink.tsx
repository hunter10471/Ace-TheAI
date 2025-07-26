"use client";
import { Roboto } from "next/font/google";
import React from "react";

interface NavLinkProps {
	route: string;
	name: string;
	isNavMenu?: boolean;
	onClick?: () => void;
}

const roboto = Roboto({ subsets: ["latin"], weight: ["500"] });

const NavLink: React.FC<NavLinkProps> = ({ route, name, isNavMenu, onClick }) => {
	const handleClick = (e: React.MouseEvent) => {
		console.log('NavLink clicked:', name, route);
		
		const targetId = route.replace('#', '');
		const element = document.getElementById(targetId);
		
		if (element) {
			console.log('Element found, scrolling to:', element.offsetTop - 100);
			const offsetTop = element.offsetTop - 100;
			window.scrollTo({
				top: offsetTop,
				behavior: 'smooth'
			});
		} else {
			console.log('Element not found:', targetId);
		}
		
		if (onClick) {
			onClick();
		}
	};

	return (
		<button
			onClick={handleClick}
			type="button"
			className={`capitalize hover:border-primary border-transparent border-b-2 transition-all px-2 lg:px-6 py-[2px] cursor-pointer ${
				isNavMenu ? "text-secondary dark:text-gray-200" : "text-text dark:text-gray-200"
			} ${roboto.className}`}
		>
			{name}
		</button>
	);
};

export default NavLink;
