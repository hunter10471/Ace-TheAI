import React from "react";
import Modal from "../Modal/Modal";
import Button from "../../small/Button/Button";

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
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            End Interview
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to end this interview ?
          </p>

          <div className="flex gap-3">
            <Button
              text="Cancel"
              type="black-outline"
              htmlButtonType="button"
              action={onClose}
              className="flex-1"
            />
            <Button
              text="End interview"
              type="primary"
              htmlButtonType="button"
              action={onConfirm}
              className="flex-1"
            />
          </div>
        </div>
      }
    />
  );
};

export default EndInterviewModal; 