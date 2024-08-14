import Hero from "@/components/big/Hero/Hero";
import Button from "@/components/small/Button/Button";
import { Roboto } from "next/font/google";

const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });

export default function Home() {
	return (
		<main>
			<div className="absolute w-screen h-screen bg-heroPattern top-0 right-0 opacity-5 z-[-1]"></div>
			<div className="flex flex-col items-center justify-center gap-4 max-w-[500px] mx-auto mb-10">
				<h1
					className={`text-[54px] text-primary font-bold leading-10  ${roboto.className}`}
				>
					Ace The AI
				</h1>
				<h1 className={`text-[54px] font-bold leading-10 ${roboto.className}`}>
					Interview Coach
				</h1>
				<p className="text-lg text-center">
					Empowering Your Interview Success with AI-Driven Insights and
					Personalized Coaching
				</p>
				<div className="flex gap-4 mt-2">
					<Button text="Get Started" type="primary" />
					<Button text="Learn More" type="black-outline" />
				</div>
			</div>
			<Hero />
		</main>
	);
}
