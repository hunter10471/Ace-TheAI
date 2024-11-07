import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import NavLink from "../../small/NavLink/NavLink";
import Button from "../../small/Button/Button";
import { navLinks } from "@/lib/data";
import { nanoid } from "nanoid";
import { MdClose } from "react-icons/md";
import { useModalStore } from "@/lib/store";

interface NavMenuProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const NavMenu: React.FC<NavMenuProps> = ({ open, setOpen }) => {
  const { openRegisterModal, openLoginModal } = useModalStore();
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

  return (
    <aside
      ref={sidebarRef}
      className={`fixed flex flex-col justify-center top-0 right-0 md:hidden h-screen w-[200px] transition-all ease-out duration-500 ${
        open ? "translate-x-[0%] opacity-100" : "translate-x-[100%] opacity-0"
      } bg-text py-6 px-4`}
    >
      <button
        onClick={() => setOpen(false)}
        className="text-secondary absolute top-5 right-5"
      >
        <MdClose size={25} />
      </button>
      <div className="flex flex-col items-center gap-5">
        {navLinks.map((link) => (
          <NavLink isNavMenu={true} key={nanoid()} {...link} />
        ))}
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
    </aside>
  );
};

export default NavMenu;
