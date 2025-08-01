import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import NavLink from "../../small/NavLink/NavLink";
import Button from "../../small/Button/Button";
import { nanoid } from "nanoid";
import { MdClose, MdDarkMode, MdLightMode } from "react-icons/md";
import { useModalStore, useThemeStore, useUserStore } from "@/lib/store";
import LogoutModal from "../LogoutModal/LogoutModal";
import { navLinks } from "@/lib/data";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface NavMenuProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const NavMenu: React.FC<NavMenuProps> = ({ open, setOpen }) => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { openRegisterModal, openLoginModal } = useModalStore();
    const { isDarkMode, toggleDarkMode } = useThemeStore();
    const { user, isAuthenticated, setUser } = useUserStore();
    const router = useRouter();
    const sidebarRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (
            sidebarRef.current &&
            !sidebarRef.current.contains(event.target as Node)
        ) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = async () => {
        try {
            await signOut({ redirect: false });
        } catch (error) {
            console.log("Error signing out:", error);
        }

        setUser(null);
        setShowLogoutModal(false);
        setOpen(false);
        router.push("/");
    };

    return (
        <aside
            ref={sidebarRef}
            className={`fixed flex flex-col justify-center top-0 right-0 md:hidden h-screen w-[200px] transition-all ease-out duration-500 ${
                open
                    ? "translate-x-[0%] opacity-100"
                    : "translate-x-[100%] opacity-0"
            } bg-text dark:bg-gray-800 py-6 px-4`}
        >
            <button
                onClick={() => setOpen(false)}
                className="text-secondary dark:text-gray-200 absolute top-5 right-5"
            >
                <MdClose size={25} />
            </button>
            <div className="flex flex-col items-center gap-5">
                {navLinks.map(link => (
                    <NavLink
                        isNavMenu={true}
                        key={nanoid()}
                        {...link}
                        onClick={() => setOpen(false)}
                    />
                ))}
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
                {isAuthenticated ? (
                    <>
                        <Button
                            htmlButtonType="button"
                            text="Dashboard"
                            action={() => {
                                setOpen(false);
                                router.push("/dashboard");
                            }}
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
            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={confirmLogout}
            />
        </aside>
    );
};

export default NavMenu;
