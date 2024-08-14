import Image from "next/image";
import Link from "next/link";
import React from "react";

interface LogoProps {
	type: "dark" | "light" | "primary";
}

const Logo: React.FC<LogoProps> = ({ type }) => {
	return (
		<Link href={"/"} className="relative h-10 w-24">
			<Image alt="ace-logo" src={"/assets/logo_dark.png"} fill />
		</Link>
	);
};

export default Logo;
