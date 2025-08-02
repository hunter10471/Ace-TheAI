"use client";
import React, { useState } from "react";
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
import { useSession } from "next-auth/react";

const LoginModal = () => {
    const { closeLoginModal, openRegisterModal, isLoginModalOpen } =
        useModalStore();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: session, status, update } = useSession();

    const handleSubmit = async (values: {
        email: string;
        password: string;
    }) => {
        try {
            setIsLoading(true);
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

                // Force session update
                await update();

                toast.success("Logged in successfully!");
                closeLoginModal();

                // Small delay to ensure session is established
                setTimeout(() => {
                    router.push("/dashboard");
                }, 500);
            } else if (result && result !== "Missing Fields.") {
                toast.error(result);
            } else {
                console.log("Unexpected result:", result);
            }
        } catch (error: any) {
            console.error("Login error:", error);
            toast.error("Login failed. Please try again.");
        } finally {
            setIsLoading(false);
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
                            disabled
                            className="relative w-full text-sm font-medium py-3 px-4 transition-all border border-gray-300 dark:border-gray-600 rounded-lg text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60 flex items-center justify-center gap-3"
                        >
                            <FcGoogle size={20} />
                            Sign in with Google (Coming Soon)
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
