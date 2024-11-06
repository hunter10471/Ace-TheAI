import Button from "@/components/small/Button/Button";
import { footerLinks } from "@/lib/data";
import { nanoid } from "nanoid";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { LuUser2 } from "react-icons/lu";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { AiFillInstagram } from "react-icons/ai";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center mt-32 gap-4">
      <Image
        src={"/assets/logo_primary_black.png"}
        width={100}
        height={100}
        alt="logo"
      />
      <h2 className="font-bold text-lg max-w-[300px] text-center leading-tight">
        Get Started with your personal AI Interview trainer
      </h2>
      <div className="hidden sm:flex gap-2 mt-2">
        <div className="relative border flex items-center gap-2 rounded-full px-5 transition-all hover:shadow-md hover:border-primary">
          <LuUser2 className="text-gray-400" size={20} />
          <input
            className="focus:outline-none"
            placeholder="Enter your email"
          />
        </div>
        <Button className="!rounded-full" text="Try Now" type="primary" />
      </div>
      <div className="mx-5 md:mx-20 grid grid-cols-2 md:grid-cols-5 justify-between gap-10 mt-10">
        {footerLinks.map((link) => (
          <Link
            key={nanoid()}
            className="capitalize md:text-left text-center font-semibold text-sm hover:underline underline-offset-4"
            href={link.route}
          >
            {link.name}
          </Link>
        ))}
      </div>
      <div className="flex gap-10 mt-10 -mb-20">
        <button className="p-2 rounded-full border border-black hover:bg-black hover:text-white transition-all">
          <FaFacebookF />
        </button>
        <button className="p-2 rounded-full border border-black hover:bg-black hover:text-white transition-all">
          <FaXTwitter />
        </button>
        <button className="p-2 rounded-full border border-black hover:bg-black hover:text-white transition-all">
          <FaYoutube />
        </button>
        <button className="p-2 rounded-full border border-black hover:bg-black hover:text-white transition-all">
          <FaInstagram />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
