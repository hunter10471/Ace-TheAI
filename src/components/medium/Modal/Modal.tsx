"use client";
import React, { useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  modalBody: React.ReactNode;
  closeModal: () => void;
  isModalOpen: boolean;
}

const Modal: React.FC<ModalProps> = ({
  modalBody,
  closeModal,
  isModalOpen,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModal]);

  return (
    <div
      className={`fixed overflow-hidden top-0 left-0 z-[999] bg-black transition-all duration-500  ${
        isModalOpen ? "bg-opacity-50" : "bg-opacity-0 pointer-events-none"
      } w-screen h-screen`}
    >
      <div
        className={`absolute transition-all duration-500 ease-in-out w-[370px] sm:w-[500px] h-fit mx-auto my-auto left-0 right-0 top-0 bottom-0 ${
          isModalOpen
            ? "translate-y-[0vh] opacity-100"
            : "translate-y-[100vh] opacity-0"
        } p-6 bg-offWhite rounded-xl`}
        ref={modalRef}
      >
        <button onClick={closeModal} className="absolute right-4 top-4">
          <IoMdClose size={20} />
        </button>
        {modalBody}
      </div>
    </div>
  );
};

export default Modal;
