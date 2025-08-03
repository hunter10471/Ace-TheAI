"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useThemeStore } from "@/lib/store";
import Input from "@/components/small/Input/Input";
import Button from "@/components/small/Button/Button";
import { changePassword } from "@/app/actions/actions";
import { ChangePasswordValidationSchema } from "@/lib/validation-schemas";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface ChangePasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function ChangePasswordForm() {
    const { isDarkMode } = useThemeStore();
    const { data: session } = useSession();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<ChangePasswordFormData>>({});

    const [formData, setFormData] = useState<ChangePasswordFormData>({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleInputChange = (
        field: keyof ChangePasswordFormData,
        value: string
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    const validateForm = async (): Promise<boolean> => {
        try {
            await ChangePasswordValidationSchema.validate(formData, {
                abortEarly: false,
            });
            setErrors({});
            return true;
        } catch (validationError: any) {
            const newErrors: Partial<ChangePasswordFormData> = {};
            validationError.inner.forEach((error: any) => {
                newErrors[error.path as keyof ChangePasswordFormData] =
                    error.message;
            });
            setErrors(newErrors);
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if user is using Google OAuth
        if (session?.user?.provider === "google") {
            toast.error(
                "Google users cannot change password through this form. Please use your Google account settings."
            );
            return;
        }

        const isValid = await validateForm();
        if (!isValid) {
            return;
        }

        setIsLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("currentPassword", formData.currentPassword);
            formDataToSend.append("newPassword", formData.newPassword);
            formDataToSend.append("confirmPassword", formData.confirmPassword);

            const result = await changePassword(formDataToSend);

            if (result === "success") {
                toast.success("Password changed successfully!");
                setFormData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } else {
                toast.error(result);
            }
        } catch (error) {
            console.error("Password change error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const titleColor = isDarkMode ? "text-gray-100" : "text-gray-900";

    return (
        <div className={`w-full`}>
            <h2 className={`text-lg font-semibold ${titleColor} mb-6`}>
                Change Password
            </h2>

            {session?.user?.provider === "google" && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        You're signed in with Google. To change your password,
                        please use your Google account settings.
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label
                        className={`text-sm font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                        Current Password
                    </label>
                    <div className="relative">
                        <Input
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Enter your current password"
                            value={formData.currentPassword}
                            onChange={e =>
                                handleInputChange(
                                    "currentPassword",
                                    e.target.value
                                )
                            }
                            className={`pr-10 ${
                                errors.currentPassword ? "border-red-500" : ""
                            }`}
                            disabled={
                                session?.user?.provider === "google" ||
                                isLoading
                            }
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            disabled={
                                session?.user?.provider === "google" ||
                                isLoading
                            }
                        >
                            {showCurrentPassword ? (
                                <EyeOff size={16} />
                            ) : (
                                <Eye size={16} />
                            )}
                        </button>
                    </div>
                    {errors.currentPassword && (
                        <p className="text-sm text-red-500">
                            {errors.currentPassword}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label
                        className={`text-sm font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                        New Password
                    </label>
                    <div className="relative">
                        <Input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter your new password"
                            value={formData.newPassword}
                            onChange={e =>
                                handleInputChange("newPassword", e.target.value)
                            }
                            className={`pr-10 ${
                                errors.newPassword ? "border-red-500" : ""
                            }`}
                            disabled={
                                session?.user?.provider === "google" ||
                                isLoading
                            }
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            disabled={
                                session?.user?.provider === "google" ||
                                isLoading
                            }
                        >
                            {showNewPassword ? (
                                <EyeOff size={16} />
                            ) : (
                                <Eye size={16} />
                            )}
                        </button>
                    </div>
                    {errors.newPassword && (
                        <p className="text-sm text-red-500">
                            {errors.newPassword}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label
                        className={`text-sm font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Enter your new password again"
                            value={formData.confirmPassword}
                            onChange={e =>
                                handleInputChange(
                                    "confirmPassword",
                                    e.target.value
                                )
                            }
                            className={`pr-10 ${
                                errors.confirmPassword ? "border-red-500" : ""
                            }`}
                            disabled={
                                session?.user?.provider === "google" ||
                                isLoading
                            }
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            disabled={
                                session?.user?.provider === "google" ||
                                isLoading
                            }
                        >
                            {showConfirmPassword ? (
                                <EyeOff size={16} />
                            ) : (
                                <Eye size={16} />
                            )}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                            {errors.confirmPassword}
                        </p>
                    )}
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        htmlButtonType="submit"
                        className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        isLoading={isLoading}
                        text={isLoading ? "Updating..." : "Save"}
                    />
                </div>
            </form>
        </div>
    );
}
