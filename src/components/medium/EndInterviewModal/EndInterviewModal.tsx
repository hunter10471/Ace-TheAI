import React from "react";
import Modal from "../Modal/Modal";
import Button from "../../small/Button/Button";
import { IoWarning } from "react-icons/io5";

interface EndInterviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const EndInterviewModal: React.FC<EndInterviewModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    return (
        <Modal
            isModalOpen={isOpen}
            closeModal={onClose}
            modalBody={
                <div className="text-center p-6">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IoWarning size={32} className="text-red-500" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        End Interview
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                        Are you sure you want to end this interview?
                        <br />
                        <span className="text-sm text-gray-500 dark:text-gray-500">
                            This action cannot be undone.
                        </span>
                    </p>

                    <div className="flex gap-4">
                        <Button
                            text="Continue Interview"
                            type="outline"
                            htmlButtonType="button"
                            action={onClose}
                            className="flex-1 py-3"
                        />
                        <Button
                            text="End Interview"
                            type="primary"
                            htmlButtonType="button"
                            action={onConfirm}
                            className="flex-1 py-3 bg-red-500 hover:bg-red-600 border-red-500"
                        />
                    </div>
                </div>
            }
        />
    );
};

export default EndInterviewModal;
