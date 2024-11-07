"use client";
import React from "react";
import Modal from "../Modal/Modal";
import { useModalStore } from "@/lib/store";
import Image from "next/image";
import Input from "@/components/small/Input/Input";
import { CiUser } from "react-icons/ci";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Button from "@/components/small/Button/Button";
import { CiMail } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Full name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain one uppercase letter, one number, and one special character"
    )
    .required("Password is required"),
  "confirm-password": Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm password is required"),
});

const RegisterModal = () => {
  const { closeRegisterModal, openLoginModal, isRegisterModalOpen } =
    useModalStore();

  const RegisterBody = (
    <div className="max-w-[320px] mx-auto flex flex-col gap-5 items-center">
      <div className="flex flex-col items-center">
        <Image
          src={"/assets/logo_primary.png"}
          alt="primary logo"
          width={100}
          height={100}
        />
        <h1 className="text-xl lg:text-2xl font-bold">Create a new account</h1>
        <span className="text-xs lg:text-sm text-gray-400">
          Enter your details to register
        </span>
      </div>
      <div className="w-full">
        <Formik
          initialValues={{ username: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => console.log(values)}
          validateOnBlur={false}
        >
          <Form>
            <Input
              label="Full Name"
              name="username"
              placeholder="Enter your full name"
              type="text"
              icon={<CiUser size={20} />}
            />
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
            <Input
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
            />
            <span className="text-center text-xs block my-1">OR</span>
            <button className="relative w-full text-sm font-medium py-2 px-4 hover:bg-text hover:text-white transition-all border border-text rounded-lg">
              <FcGoogle size={25} className="absolute bottom-[5px] left-14" />{" "}
              Sign up with Google
            </button>
            <span className="text-xs my-4 text-center block leading-relaxed">
              By clicking Sign Up, you agree to accept Ace The AI’s{" "}
              <em className="text-primary hover:underline cursor-pointer">
                Terms & Conditions.
              </em>
            </span>
            <span className="block text-center text-xs">
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
