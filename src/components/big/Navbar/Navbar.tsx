"use client";
import React, { useEffect, useState } from "react";
import Logo from "../../small/Logo/Logo";
import NavLink from "../../small/NavLink/NavLink";
import { nanoid } from "nanoid";
import Button from "../../small/Button/Button";
import { MdMenu, MdDarkMode, MdLightMode } from "react-icons/md";
import NavMenu from "../../medium/NavMenu/NavMenu";
import LogoutModal from "../../medium/LogoutModal/LogoutModal";
import { useModalStore, useThemeStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { navLinks } from "@/lib/data";
import { signOut, useSession } from "next-auth/react";

const Navbar: React.FC = () => {
    const [scroll, setScroll] = useState(false);
    const [open, setOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useRouter();
    const { openRegisterModal, openLoginModal } = useModalStore();
    const { isDarkMode, toggleDarkMode } = useThemeStore();
    const { data: session, status, update } = useSession();

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
    }, []);

    const navigateToDashboard = () => {
        navigate.push("/dashboard");
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = async () => {
        try {
            await signOut({ redirect: false });
        } catch (error) {
            console.log("Error signing out:", error);
        }

        setShowLogoutModal(false);
        navigate.push("/");
    };

    return (
        <div
            className={`fixed z-[99] top-0 w-screen flex items-center justify-center transition-all h-[70px] ${
                scroll
                    ? "shadow-lg bg-white dark:bg-gray-900"
                    : "shadow-none bg-transparent"
            }`}
        >
            <div className="w-full max-w-screen-xl p-4 lg:p-6 flex items-center justify-between">
                <Logo type={isDarkMode ? "light" : "dark"} />
                <div className="hidden md:flex gap-5">
                    {navLinks.map(link => (
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
                            <MdLightMode
                                size={20}
                                className="text-gray-600 dark:text-gray-300"
                            />
                        ) : (
                            <MdDarkMode
                                size={20}
                                className="text-gray-600 dark:text-gray-300"
                            />
                        )}
                    </button>
                    {status === "loading" ? (
                        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 w-20 rounded-lg"></div>
                    ) : session ? (
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
                            <MdLightMode
                                size={20}
                                className="text-gray-600 dark:text-gray-300"
                            />
                        ) : (
                            <MdDarkMode
                                size={20}
                                className="text-gray-600 dark:text-gray-300"
                            />
                        )}
                    </button>
                    <button
                        onClick={() => setOpen(true)}
                        className="text-gray-600 dark:text-gray-300"
                    >
                        <MdMenu size={25} />
                    </button>
                </div>
            </div>
            <NavMenu open={open} setOpen={setOpen} />
            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={confirmLogout}
            />
        </div>
    );
};

export default Navbar;
