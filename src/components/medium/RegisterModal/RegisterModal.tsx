"use client";
import React, { useState, useEffect, useRef } from "react";
import { useModalStore } from "@/lib/store";
import Image from "next/image";
import FormikInput from "@/components/small/FormikInput/FormikInput";
import { CiUser } from "react-icons/ci";
import { Form, Formik } from "formik";
import Button from "@/components/small/Button/Button";
import { CiMail } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";
import { SignupValidationSchema } from "@/lib/validation-schemas";
import { UserFormData } from "@/lib/types";
import toast from "react-hot-toast";
import Modal from "../Modal/Modal";
import { signup } from "@/app/actions/actions";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/components/providers/LoadingProvider";

const RegisterModal = () => {
    const {
        closeRegisterModal,
        openLoginModal,
        isRegisterModalOpen,
        closeAllModals,
    } = useModalStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const router = useRouter();

    const { showLoading, hideLoading } = useLoading();

    const handleSubmit = async (values: UserFormData) => {
        try {
            setIsLoading(true);
            showLoading("Creating your account...");

            const startTime = Date.now();

            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("email", values.email);
            formData.append("password", values.password);
            const result = await signup(formData);

            // Ensure minimum 2 seconds of loading
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(2000 - elapsedTime, 0);
            await new Promise(resolve => setTimeout(resolve, remainingTime));

            if (result === "success") {
                hideLoading();
                toast.success("Account created successfully!");
                closeAllModals();
                openLoginModal();
            } else if (result) {
                hideLoading();
                toast.error(result);
            }
        } catch (error: any) {
            hideLoading();
            toast.error("Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            setIsGoogleLoading(true);
            showLoading("Redirecting to Google sign-up...");

            console.log("Starting Google sign-up process...");

            // Use direct redirect instead of popup
            await signIn("google", {
                callbackUrl: `${window.location.origin}/dashboard`,
                redirect: true,
            });
        } catch (error) {
            hideLoading();
            console.error("Google sign-up error:", error);
            toast.error("Google sign-up failed. Please try again.");
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const RegisterBody = (
        <div className="max-w-[320px] mx-auto flex flex-col gap-3 items-center">
            <div className="flex flex-col items-center">
                <Image
                    src={"/assets/logo_primary.png"}
                    alt="primary logo"
                    width={80}
                    height={80}
                />
                <h1 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mt-2">
                    Create a new account
                </h1>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                    Enter your details to register
                </span>
            </div>
            <div className="w-full">
                <Formik
                    initialValues={{ name: "", email: "", password: "" }}
                    validationSchema={SignupValidationSchema}
                    onSubmit={handleSubmit}
                    validateOnBlur={false}
                >
                    <Form>
                        <FormikInput
                            label="Full Name"
                            name="name"
                            placeholder="Enter your full name"
                            type="text"
                            icon={<CiUser size={20} />}
                        />
                        <FormikInput
                            label="Email"
                            name="email"
                            placeholder="Enter your email"
                            type="email"
                            icon={<CiMail size={20} />}
                        />
                        <FormikInput
                            label="Password"
                            name="password"
                            placeholder="Enter your password"
                            type="password"
                            icon={<CiLock size={20} />}
                        />
                        <FormikInput
                            label="Confirm Password"
                            name="confirm-password"
                            placeholder="Enter your password again"
                            type="password"
                            icon={<CiLock size={20} />}
                        />
                        <Button
                            className="w-full mt-1"
                            htmlButtonType="submit"
                            text={isLoading ? "Creating account..." : "Sign Up"}
                            type="primary"
                            isLoading={isLoading}
                        />
                        <span className="text-center text-xs block my-1 text-gray-500 dark:text-gray-400">
                            OR
                        </span>
                        <button
                            type="button"
                            onClick={handleGoogleSignUp}
                            disabled={isGoogleLoading}
                            className="relative w-full text-sm font-medium py-3 px-4 transition-all border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <FcGoogle size={20} />
                            {isGoogleLoading
                                ? "Creating account..."
                                : "Sign up with Google"}
                        </button>
                        <span className="text-xs my-2 text-center block leading-relaxed text-gray-600 dark:text-gray-400">
                            By clicking Sign Up, you agree to accept Ace The
                            AI's{" "}
                            <em className="text-primary hover:underline cursor-pointer">
                                Terms & Conditions.
                            </em>
                        </span>
                        <span className="block text-center text-xs text-gray-600 dark:text-gray-400">
                            Already have an account?{" "}
                            <button
                                onClick={() => {
                                    closeRegisterModal();
                                    openLoginModal();
                                }}
                                className="text-primary hover:underline font-medium"
                            >
                                Login
                            </button>
                        </span>
                    </Form>
                </Formik>
            </div>
        </div>
    );

    return (
        <Modal
            isModalOpen={isRegisterModalOpen}
            modalBody={RegisterBody}
            closeModal={closeRegisterModal}
        />
    );
};

export default RegisterModal;
