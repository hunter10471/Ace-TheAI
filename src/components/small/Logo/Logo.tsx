import Image from "next/image";
import Link from "next/link";
import React from "react";

interface LogoProps {
    type: "dark" | "light" | "primary";
}

const Logo: React.FC<LogoProps> = ({ type }) => {
    const getLogoSrc = () => {
        switch (type) {
            case "light":
                return "/assets/logo_light.png";
            case "primary":
                return "/assets/logo_primary.png";
            case "dark":
            default:
                return "/assets/logo_dark.png";
        }
    };

    return (
        <Link href={"/"} className="relative h-10 w-24">
            <Image alt="ace-logo" src={getLogoSrc()} fill />
        </Link>
    );
};

export default Logo;
