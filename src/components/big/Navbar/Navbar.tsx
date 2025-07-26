"use client";
import React, { useEffect, useState } from "react";
import Logo from "../../small/Logo/Logo";
import NavLink from "../../small/NavLink/NavLink";
import { nanoid } from "nanoid";
import Button from "../../small/Button/Button";
import { MdMenu, MdDarkMode, MdLightMode } from "react-icons/md";
import NavMenu from "../../medium/NavMenu/NavMenu";
import { useModalStore, useThemeStore, useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { navLinks } from "@/lib/data";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const [scroll, setScroll] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useRouter();
  const { openRegisterModal, openLoginModal } = useModalStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { user, isAuthenticated, setUser } = useUserStore();
  
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

  const navigateToDashboard = () => {
    navigate.push("/dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    navigate.push("/");
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.log('Not authenticated');
      }
    };
    
    checkAuth();
  }, [setUser]);

  return (
    <div
      className={`fixed z-[99] top-0 w-screen flex items-center justify-center transition-all h-[70px] ${
        scroll ? "shadow-lg bg-white dark:bg-gray-900" : "shadow-none bg-transparent"
      }`}
    >
      <div className="w-full max-w-screen-xl p-4 lg:p-6 flex items-center justify-between">
        <Logo type={isDarkMode ? "light" : "dark"} />
        <div className="hidden md:flex gap-5">
          {navLinks.map((link) => (
            <NavLink key={nanoid()} {...link} />
          ))}
        </div>
        <div className="hidden md:flex gap-2 lg:gap-5 items-center">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <MdLightMode size={20} className="text-gray-600 dark:text-gray-300" />
            ) : (
              <MdDarkMode size={20} className="text-gray-600 dark:text-gray-300" />
            )}
          </button>
          {isAuthenticated ? (
            <>
              <Button
                htmlButtonType="button"
                text="Dashboard"
                action={navigateToDashboard}
                type="primary"
              />
              <Button
                htmlButtonType="button"
                text="Logout"
                action={handleLogout}
                type="outline"
              />
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <MdLightMode size={20} className="text-gray-600 dark:text-gray-300" />
            ) : (
              <MdDarkMode size={20} className="text-gray-600 dark:text-gray-300" />
            )}
          </button>
          <button onClick={() => setOpen(true)} className="text-gray-600 dark:text-gray-300">
            <MdMenu size={25} />
          </button>
        </div>
      </div>
      <NavMenu open={open} setOpen={setOpen} />
    </div>
  );
};

export default Navbar;
