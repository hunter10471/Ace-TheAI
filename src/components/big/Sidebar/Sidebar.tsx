"use client";
import { sidebarLinks } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { IoIosMenu } from "react-icons/io";
import { IoIosArrowRoundBack } from "react-icons/io";

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = ({}) => {
  const path = usePathname();
  const [open, setOpen] = useState(true);

  return (
    <div className="fixed left-0 top-0 h-full z-[99] flex">
      <div
        className={`bg-text dark:bg-gray-900 h-full transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "w-[180px] lg:w-[250px]" : "w-0"
        }`}
      >
        <div className="w-[150px] lg:w-[230px] p-4">
          <Image
            src={"/assets/logo_primary.png"}
            width={100}
            height={100}
            alt="Primary Logo"
            className="mb-6"
          />
          <div className="flex flex-col">
            {sidebarLinks.map((link, index) =>
              link.url ? (
                <Link
                  key={index}
                  className={`flex whitespace-nowrap items-center gap-2 text-xs lg:text-sm px-2 lg:px-4 py-1.5 border border-transparent transition-all mt-2 lg:mt-3 rounded-lg ${
                    path === link.url
                      ? "bg-primary text-offWhite dark:text-white"
                      : "text-offWhite/50 dark:text-gray-400 hover:border-primary hover:text-offWhite dark:hover:text-gray-200"
                  }`}
                  href={link.url}
                >
                  {link.icon && (
                    <link.icon className="flex-shrink-0" size={20} />
                  )}{" "}
                  {link.label}
                </Link>
              ) : (
                <h3
                  key={index}
                  className="text-offWhite/50 dark:text-gray-500 uppercase text-[10px] lg:text-xs mt-6 lg:mt-8 px-2 lg:px-4"
                >
                  {link.label}
                </h3>
              )
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-center h-10 w-10 bg-text dark:bg-gray-900 transition-colors rounded-tr-lg rounded-br-lg mt-4 text-white dark:text-gray-200 ${
          open ? "-mr-10" : "ml-0"
        }`}
      >
        {open ? <IoIosArrowRoundBack size={30} /> : <IoIosMenu size={25} />}
      </button>
    </div>
  );
};

export default Sidebar;
