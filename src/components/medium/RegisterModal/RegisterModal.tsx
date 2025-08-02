"use client";
import React, { useState } from "react";
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

const RegisterModal = () => {
    const { closeRegisterModal, openLoginModal, isRegisterModalOpen } =
        useModalStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (values: UserFormData) => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("email", values.email);
            formData.append("password", values.password);
            await signup(formData);
            toast.success("Account created successfully!");
            closeRegisterModal();
            openLoginModal();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const RegisterBody = (
        <div className="max-w-[320px] mx-auto flex flex-col gap-5 items-center">
            <div className="flex flex-col items-center">
                <Image
                    src={"/assets/logo_primary.png"}
                    alt="primary logo"
                    width={100}
                    height={100}
                />
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                    Create a new account
                </h1>
                <span className="text-xs lg:text-sm text-gray-400 dark:text-gray-500">
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
                            className="w-full mt-2"
                            htmlButtonType="submit"
                            text="Sign Up"
                            type="primary"
                            isLoading={isLoading}
                        />
                        <span className="text-center text-xs block my-1 text-gray-500 dark:text-gray-400">
                            OR
                        </span>
                        <button className="relative w-full text-sm font-medium py-2 px-4 hover:bg-text hover:text-white dark:hover:bg-gray-700 transition-all border border-text dark:border-gray-600 rounded-lg text-gray-900 dark:text-white">
                            <FcGoogle
                                size={25}
                                className="absolute bottom-[5px] left-14"
                            />{" "}
                            Sign up with Google
                        </button>
                        <span className="text-xs my-4 text-center block leading-relaxed text-gray-600 dark:text-gray-400">
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
