"use client";
import React, { useEffect, useState } from "react";
import Logo from "../../small/Logo/Logo";
import { navLinks } from "@/lib/data";
import NavLink from "../../small/NavLink/NavLink";
import { nanoid } from "nanoid";
import Button from "../../small/Button/Button";
import { MdMenu } from "react-icons/md";
import NavMenu from "../../medium/NavMenu/NavMenu";
import { useModalStore } from "@/lib/store";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const [scroll, setScroll] = useState(false);
  const [open, setOpen] = useState(false);
  const { openRegisterModal, openLoginModal } = useModalStore();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scroll]);
  return (
    <div
      className={`fixed z-[99] bg-secondary top-0 w-screen overflow-hidden flex items-center justify-center transition-all h-[70px] ${
        scroll ? "shadow-lg bg-white" : "shadow-none bg-transparent"
      }`}
    >
      <div className="w-full max-w-screen-xl p-4 lg:p-6 flex items-center justify-between">
        <Logo type="dark" />
        <div className="hidden md:flex gap-5">
          {navLinks.map((link) => (
            <NavLink key={nanoid()} {...link} />
          ))}
        </div>
        <div className="hidden md:flex gap-2 lg:gap-5">
          <Button
            htmlButtonType="button"
            text="Signup"
            action={openRegisterModal}
            type="primary"
          />
          <Button
            htmlButtonType="button"
            text="Login"
            action={openLoginModal}
            type="outline"
          />
        </div>
        <button onClick={() => setOpen(true)} className="flex md:hidden">
          <MdMenu size={25} />
        </button>
      </div>
      <NavMenu open={open} setOpen={setOpen} />
    </div>
  );
};

export default Navbar;
