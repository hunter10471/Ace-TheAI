"use client";
import React, { useState, useEffect, useRef } from "react";
import Modal from "../Modal/Modal";
import { useModalStore } from "@/lib/store";
import toast from "react-hot-toast";
import Image from "next/image";
import FormikInput from "@/components/small/FormikInput/FormikInput";
import { CiMail } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import { Form, Formik } from "formik";
import Button from "@/components/small/Button/Button";
import { FcGoogle } from "react-icons/fc";
import { LoginValidationSchema } from "@/lib/validation-schemas";
import { useRouter } from "next/navigation";
import { authenticate } from "@/app/actions/actions";
import { useSession, signIn } from "next-auth/react";
import { useLoading } from "@/components/providers/LoadingProvider";

const LoginModal = () => {
    const {
        closeLoginModal,
        openRegisterModal,
        isLoginModalOpen,
        closeAllModals,
    } = useModalStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const router = useRouter();
    const { data: session, status, update } = useSession();
    const { showLoading, hideLoading } = useLoading();

    // Listen for session changes when modal is open
    useEffect(() => {
        if (!isLoginModalOpen) return;

        const checkSession = async () => {
            // Update session periodically while modal is open
            const freshSession = await update();
            if (freshSession?.user) {
                toast.success("Logged in with Google successfully!");
                closeAllModals();
                router.push("/dashboard");
            }
        };

        // Check session every 2 seconds while modal is open
        const interval = setInterval(checkSession, 2000);

        return () => clearInterval(interval);
    }, [isLoginModalOpen, update, closeAllModals, router]);

    const handleSubmit = async (values: {
        email: string;
        password: string;
    }) => {
        try {
            setIsLoading(true);
            showLoading("Authenticating...");
            console.log("Attempting login with:", values.email);

            const formData = new FormData();
            formData.append("email", values.email);
            formData.append("password", values.password);

            const result = await authenticate(undefined, formData);
            console.log("Authentication result:", result);

            console.log("LoginModal result:", result);

            if (result === "success") {
                console.log("Authentication successful, checking session...");
                console.log("Session status:", status);
                console.log("Session data:", session);

                await update();

                toast.success("Logged in successfully!");
                closeAllModals();

                showLoading("Redirecting to dashboard...");
                setTimeout(() => {
                    hideLoading();
                    router.push("/dashboard");
                }, 2000);
            } else if (result && result !== "Missing Fields.") {
                hideLoading();
                toast.error(result);
            } else {
                hideLoading();
                console.log("Unexpected result:", result);
            }
        } catch (error: any) {
            hideLoading();
            console.error("Login error:", error);
            toast.error("Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setIsGoogleLoading(true);
            showLoading("Redirecting to Google sign-in...");

            console.log("Starting Google sign-in process...");
            console.log("Current session status:", status);
            console.log("Current session data:", session);

            // Use direct redirect instead of popup
            await signIn("google", {
                callbackUrl: `${window.location.origin}/dashboard`,
                redirect: true,
            });
        } catch (error) {
            hideLoading();
            console.error("Google sign-in error:", error);
            toast.error("Google sign-in failed. Please try again.");
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const LoginBody = (
        <div className="max-w-[320px] mx-auto flex flex-col gap-5 items-center">
            <div className="flex flex-col items-center">
                <Image
                    src={"/assets/logo_primary.png"}
                    alt="primary logo"
                    width={100}
                    height={100}
                />
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                    Welcome Back!
                </h1>
                <span className="text-xs lg:text-sm text-gray-400 dark:text-gray-500">
                    Enter your details to log in
                </span>
            </div>
            <div className="w-full">
                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={LoginValidationSchema}
                    onSubmit={handleSubmit}
                    validateOnBlur={false}
                >
                    <Form>
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
                        <Button
                            className="w-full mt-2"
                            htmlButtonType="submit"
                            text={isLoading ? "Logging in..." : "Log In"}
                            type="primary"
                            isLoading={isLoading}
                        />
                        <span className="text-center text-xs block my-1 text-gray-500 dark:text-gray-400">
                            OR
                        </span>
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={isGoogleLoading}
                            className="relative w-full text-sm font-medium py-3 px-4 transition-all border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <FcGoogle size={20} />
                            {isGoogleLoading
                                ? "Signing in..."
                                : "Sign in with Google"}
                        </button>
                        <span className="block text-center text-xs mt-4 text-gray-600 dark:text-gray-400">
                            Don't have an account?{" "}
                            <button
                                onClick={() => {
                                    closeLoginModal();
                                    openRegisterModal();
                                }}
                                className="text-primary hover:underline font-medium"
                            >
                                Register
                            </button>
                        </span>
                    </Form>
                </Formik>
            </div>
        </div>
    );

    return (
        <Modal
            isModalOpen={isLoginModalOpen}
            modalBody={LoginBody}
            closeModal={closeLoginModal}
        />
    );
};

export default LoginModal;
