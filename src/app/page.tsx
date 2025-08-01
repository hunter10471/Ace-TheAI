import Container from "@/components/big/Container/Container";
import Hero from "@/components/big/Hero/Hero";
import Feature from "@/components/medium/Feature/Feature";
import Footer from "@/components/medium/Footer/Footer";
import HeroButtons from "@/components/medium/HeroButtons/HeroButtons";
import LoginModal from "@/components/medium/LoginModal/LoginModal";
import ProcessStep from "@/components/medium/ProcessStep/ProcessStep";
import ReadyBanner from "@/components/medium/ReadyBanner/ReadyBanner";
import RegisterModal from "@/components/medium/RegisterModal/RegisterModal";
import ReviewSlider from "@/components/medium/ReviewSlider/ReviewSlider";
import Heading from "@/components/small/Heading/Heading";
import { nanoid } from "nanoid";
import { Roboto } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { features, processSteps } from "@/lib/data";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["100", "300", "400", "500", "700"],
});

export default function Home() {
    return (
        <Container>
            <Toaster position="bottom-center" />
            <div className="absolute w-screen h-screen bg-heroPattern top-0 right-0 opacity-5 dark:opacity-3 z-[-1]"></div>
            <div
                id="home"
                className="flex flex-col items-center justify-center gap-0 lg:gap-4 max-w-[500px] mx-auto text-center"
            >
                <h1
                    className={`text-[42px] lg:text-[54px] leading-[30px] lg:leading-[54px] text-primary font-bold  ${roboto.className}`}
                >
                    Ace The AI
                </h1>
                <h1
                    className={`text-[42px] lg:text-[54px] leading-[64px] lg:leading-[54px] font-bold text-text dark:text-gray-100 ${roboto.className}`}
                >
                    Interview Coach
                </h1>
                <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400">
                    Empowering Your Interview Success with AI-Driven Insights
                    and Personalized Coaching
                </p>
                <HeroButtons />
            </div>
            <Hero />
            <div id="features">
                <Heading
                    className="max-w-[400px] mx-auto text-center"
                    text="Experience the Future of Interview Preparation"
                    preTitle="our features"
                />
                <div className="flex flex-col my-10 gap-16">
                    {features.map((feature, index) => (
                        <Feature index={index} key={nanoid()} {...feature} />
                    ))}
                </div>
            </div>
            <div id="how-it-works" className="mt-20">
                <Heading
                    className="max-w-[400px] mx-auto text-center"
                    text="How to get started and land your dream job"
                    preTitle="our process"
                />
                <div className="grid grid-cols-2 md:ml-0 ml-5 gap-5 md:gap-0 my-10 justify-between">
                    {processSteps.map((step, index) => (
                        <ProcessStep
                            key={nanoid()}
                            index={index + 1}
                            {...step}
                        />
                    ))}
                </div>
            </div>
            <div id="reviews">
                <ReviewSlider />
            </div>
            <div id="contact">
                <ReadyBanner />
                <Footer />
            </div>
            <RegisterModal />
            <LoginModal />
        </Container>
    );
}
