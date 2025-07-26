import React, { useState } from "react";
import Modal from "../Modal/Modal";
import Button from "../../small/Button/Button";

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, message: string) => void;
}

const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ email: "", message: "" });

  const handleSubmit = () => {
    const newErrors = { email: "", message: "" };
    
    if (!email.trim()) {
      newErrors.email = "Please enter your email address";
    }
    
    if (!message.trim()) {
      newErrors.message = "Please enter your issue here";
    }
    
    if (newErrors.email || newErrors.message) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(email, message);
    setEmail("");
    setMessage("");
    setErrors({ email: "", message: "" });
  };

  const handleClose = () => {
    setEmail("");
    setMessage("");
    setErrors({ email: "", message: "" });
    onClose();
  };

  return (
    <Modal
      isModalOpen={isOpen}
      closeModal={handleClose}
      modalBody={
        <div className="text-center p-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Report an Issue
          </h2>
          
          <div className="text-left space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue here"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white resize-none"
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              text="Cancel"
              type="black-outline"
              htmlButtonType="button"
              action={handleClose}
              className="flex-1"
            />
            <Button
              text="Submit"
              type="primary"
              htmlButtonType="button"
              action={handleSubmit}
              className="flex-1"
            />
          </div>
        </div>
      }
    />
  );
};

export default ReportIssueModal; 