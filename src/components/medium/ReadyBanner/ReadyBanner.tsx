"use client";
import Button from "@/components/small/Button/Button";
import { useModalStore } from "@/lib/store";
import Image from "next/image";
import React from "react";

const ReadyBanner = () => {
    const { openRegisterModal } = useModalStore();
    return (
        <div className="flex lg:flex-row flex-col-reverse justify-between items-center my-20 mx-5 lg:mx-20 py-8 px-5 lg:p-10 bg-text rounded-xl text-white">
            <div className="flex flex-col lg:text-left text-center gap-4 max-w-[350px]">
                <h1 className="text-2xl lg:text-3xl font-semibold">
                    Ready to Ace Your Next Interview?
                </h1>
                <p className="font-light text-xs lg:text-sm">
                    Feeling nervous about upcoming interviews? Don't worry,
                    you're not alone! With Ace the AI, you don't have to face
                    them alone anymore.
                </p>
                <Button
                    htmlButtonType="button"
                    text="Get Started"
                    type="primary"
                    action={openRegisterModal}
                />
            </div>
            <Image
                src={"/assets/call-to-action.png"}
                width={300}
                height={300}
                alt="Cool guy"
            />
        </div>
    );
};

export default ReadyBanner;
