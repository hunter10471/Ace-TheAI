"use client";
import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { useModalStore } from "@/lib/store";
import toast, { Toaster } from 'react-hot-toast';
import Image from "next/image";
import Input from "@/components/small/Input/Input";
import { CiMail } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import { Form, Formik } from "formik";
import Button from "@/components/small/Button/Button";
import { FcGoogle } from "react-icons/fc";
import { LoginValidationSchema } from "@/lib/validation-schemas";
import { signIn } from "next-auth/react";

const LoginModal = () => {
  const { closeLoginModal, openRegisterModal, isLoginModalOpen } =
    useModalStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: { email: string, password: string }) => {
    try {
      setIsLoading(true);
      await signIn("credentials", {redirect: false, ...values});
      toast.success("Logged in successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const LoginBody = (
    <div className="max-w-[320px] mx-auto flex flex-col gap-5 items-center">
      <div className="flex flex-col items-center">
        <Image
          src={"/assets/logo_primary.png"}
          alt="primary logo"
          width={100}
          height={100}
        />
        <h1 className="text-xl lg:text-2xl font-bold">Welcome Back!</h1>
        <span className="text-xs lg:text-sm text-gray-400">
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
            <Input
              label="Email"
              name="email"
              placeholder="Enter your email"
              type="email"
              icon={<CiMail size={20} />}
            />
            <Input
              label="Password"
              name="password"
              placeholder="Enter your password"
              type="password"
              icon={<CiLock size={20} />}
            />
            <Button
              className="w-full mt-2"
              htmlButtonType="submit"
              text="Log In"
              type="primary"
              isLoading={isLoading}
            />
            <span className="text-center text-xs block my-1">OR</span>
            <button className="relative w-full text-sm font-medium py-2 px-4 hover:bg-text hover:text-white transition-all border border-text rounded-lg">
              <FcGoogle size={25} className="absolute bottom-[5px] left-14" />{" "}
              Sign in with Google
            </button>
            <span className="block text-center text-xs mt-4">
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
