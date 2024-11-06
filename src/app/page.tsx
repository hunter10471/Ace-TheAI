import Hero from "@/components/big/Hero/Hero";
import Feature from "@/components/medium/Feature/Feature";
import Footer from "@/components/medium/Footer/Footer";
import ProcessStep from "@/components/medium/ProcessStep/ProcessStep";
import ReadyBanner from "@/components/medium/ReadyBanner/ReadyBanner";
import ReviewSlider from "@/components/medium/ReviewSlider/ReviewSlider";
import Button from "@/components/small/Button/Button";
import Heading from "@/components/small/Heading/Heading";
import { features, processSteps } from "@/lib/data";
import { nanoid } from "nanoid";
import { Roboto } from "next/font/google";

const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });

export default function Home() {
  return (
    <main>
      <div className="absolute w-screen h-screen bg-heroPattern top-0 right-0 opacity-5 z-[-1]"></div>
      <div className="flex flex-col items-center justify-center gap-0 lg:gap-4 max-w-[500px] mx-auto text-center">
        <h1
          className={`text-[42px] lg:text-[54px] leading-[64px] lg:leading-[54px] text-primary font-bold  ${roboto.className}`}
        >
          Ace The AI
        </h1>
        <h1
          className={`text-[42px] lg:text-[54px] leading-[64px] lg:leading-[54px] font-bold ${roboto.className}`}
        >
          Interview Coach
        </h1>
        <p className="text-base lg:text-lg">
          Empowering Your Interview Success with AI-Driven Insights and
          Personalized Coaching
        </p>
        <div className="flex gap-4 mt-2">
          <Button text="Get Started" type="primary" />
          <Button text="Learn More" type="black-outline" />
        </div>
      </div>
      <Hero />
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
      <Heading
        className="max-w-[400px] mt-20 mx-auto text-center"
        text="How to get started and land your dream job"
        preTitle="our process"
      />
      <div className="grid grid-cols-2 md:ml-0 ml-5 gap-5 md:gap-0 my-10 justify-between">
        {processSteps.map((step, index) => (
          <ProcessStep key={nanoid()} index={index + 1} {...step} />
        ))}
      </div>
      <ReviewSlider />
      <ReadyBanner />
      <Footer />
    </main>
  );
}
