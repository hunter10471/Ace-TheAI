"use client";
import React, { useEffect, useRef, useCallback } from "react";
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

    const handleClickOutside = useCallback(
        (event: MouseEvent) => {
            if (
                isModalOpen &&
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                closeModal();
            }
        },
        [isModalOpen, closeModal]
    );

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    return (
        <div
            className={`fixed overflow-hidden top-0 left-0 z-[999] transition-all duration-500 ${
                isModalOpen
                    ? "bg-opacity-50 dark:bg-opacity-70 backdrop-blur-sm bg-black/50 dark:bg-gray-900/50"
                    : "bg-opacity-0 dark:bg-opacity-0 pointer-events-none"
            } w-screen h-screen flex items-center justify-center`}
        >
            <div
                className={`transition-all duration-500 ease-in-out w-[90vw] max-w-[500px] max-h-[90vh] ${
                    isModalOpen
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0"
                } p-4 bg-offWhite dark:bg-gray-800 rounded-xl overflow-y-auto flex flex-col`}
                ref={modalRef}
            >
                <button
                    onClick={closeModal}
                    className="absolute right-3 top-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 z-10"
                >
                    <IoMdClose size={20} />
                </button>
                <div className="flex-1 flex items-center justify-center min-h-0">
                    {modalBody}
                </div>
            </div>
        </div>
    );
};

export default Modal;
