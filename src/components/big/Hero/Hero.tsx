"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Message {
	id: number;
	text: string;
	sender: 'user' | 'ai';
	delay?: number;
}

interface Conversation {
	id: number;
	messages: Message[];
}

const conversations: Conversation[] = [
	{
		id: 1,
		messages: [
			{ id: 1, text: "Help me prepare for a software engineer interview at Google", sender: 'user', delay: 1000 },
			{ id: 2, text: "I'd love to help you prepare for your Google software engineer interview! Let's start with some common technical questions. Can you walk me through how you would approach designing a scalable chat application?", sender: 'ai', delay: 2000 },
			{ id: 3, text: "I'd start by identifying the key components: user authentication, message storage, real-time messaging, and notification system", sender: 'user', delay: 3000 },
			{ id: 4, text: "Excellent start! Your approach shows good system design thinking. For the real-time messaging, what technologies would you consider and why?", sender: 'ai', delay: 2500 },
		]
	},
	{
		id: 2,
		messages: [
			{ id: 1, text: "I'm nervous about behavioral questions. Can you help me practice?", sender: 'user', delay: 1000 },
			{ id: 2, text: "Absolutely! Behavioral questions are crucial for showing your soft skills. Let's practice with a common one: 'Tell me about a time you had to work with a difficult team member.'", sender: 'ai', delay: 2000 },
			{ id: 3, text: "At my last job, I had to collaborate with a colleague who was often dismissive of others' ideas during meetings", sender: 'user', delay: 3000 },
			{ id: 4, text: "Great setup! Now tell me about the specific actions you took to address this situation. Remember to use the STAR method - what was your specific Task, Action, and Result?", sender: 'ai', delay: 2500 },
		]
	},
	{
		id: 3,
		messages: [
			{ id: 1, text: "What questions should I ask at the end of my interview?", sender: 'user', delay: 1000 },
			{ id: 2, text: "Great question! Asking thoughtful questions shows genuine interest. Here are some powerful ones: 'What does success look like in this role after 6 months?' and 'What challenges is the team currently facing?'", sender: 'ai', delay: 2000 },
			{ id: 3, text: "Those are good! Should I ask about company culture too?", sender: 'user', delay: 2500 },
			{ id: 4, text: "Absolutely! Try: 'How would you describe the team dynamics and collaboration style?' This shows you value teamwork and want to ensure you're a good fit.", sender: 'ai', delay: 2000 },
		]
	}
];

const Hero = () => {
	const [currentConversation, setCurrentConversation] = useState(0);
	const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
	const [isTyping, setIsTyping] = useState(false);
	const [typingText, setTypingText] = useState('');
	const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
	const [shouldStartTyping, setShouldStartTyping] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const messagesContainerRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		if (messagesContainerRef.current) {
			messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [currentMessages, isTyping]);

	const resetConversation = () => {
		setCurrentMessages([]);
		setCurrentMessageIndex(0);
		setIsTyping(false);
		setTypingText('');
		setShouldStartTyping(false);
	};

	const startNextConversation = () => {
		resetConversation();
		setCurrentConversation((prev) => (prev + 1) % conversations.length);
		setTimeout(() => {
			setShouldStartTyping(true);
		}, 500);
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			setShouldStartTyping(true);
		}, 1000);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (!shouldStartTyping) return;

		const currentConv = conversations[currentConversation];
		if (currentMessageIndex >= currentConv.messages.length) {
			const timer = setTimeout(() => {
				startNextConversation();
			}, 3000);
			return () => clearTimeout(timer);
		}

		const message = currentConv.messages[currentMessageIndex];
		const timer = setTimeout(() => {
			setIsTyping(true);
			typeMessage(message.text, message.sender);
		}, message.delay || 1000);

		return () => clearTimeout(timer);
	}, [currentMessageIndex, currentConversation, shouldStartTyping]);

	const typeMessage = (text: string, sender: 'user' | 'ai') => {
		setTypingText('');
		let index = 0;
		
		const typeInterval = setInterval(() => {
			if (index < text.length) {
				setTypingText(text.substring(0, index + 1));
				index++;
			} else {
				clearInterval(typeInterval);
				setIsTyping(false);
				
				setCurrentMessages(prev => [...prev, {
					id: Date.now(),
					text: text,
					sender: sender
				}]);
				
				setTypingText('');
				setCurrentMessageIndex(prev => prev + 1);
			}
		}, sender === 'user' ? 50 : 30);
	};

	return (
		<div className="w-full max-w-4xl mx-auto my-16">
			<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-[600px] flex flex-col">
				<div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-gray-700 dark:to-gray-600 border-b border-gray-100 dark:border-gray-600 px-6 py-4">
					<div className="flex items-center gap-4">
						<div className="relative">
							<div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-600">
								<Image
									src="/assets/logo_robot.png"
									alt="Ace AI Robot"
									width={28}
									height={28}
									className="object-contain"
								/>
							</div>
						</div>
						<div className="flex-1">
							<h3 className="font-semibold text-gray-900 dark:text-white text-lg">Ace AI Coach</h3>
							<p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
								<span className="w-2 h-2 bg-green-500 rounded-full"></span>
								Online • Ready to help with your interview prep
							</p>
						</div>
					</div>
				</div>

				<div 
					ref={messagesContainerRef} 
					className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50/30 dark:bg-gray-900/30 custom-scrollbar"
					style={{
						scrollbarWidth: 'thin',
						scrollbarColor: '#d1d5db transparent',
					}}
				>
					<div className="flex items-start gap-3 max-w-4xl">
						<div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-600 flex-shrink-0">
							<Image
								src="/assets/logo_robot.png"
								alt="Ace AI Robot"
								width={24}
								height={24}
								className="object-contain"
							/>
						</div>
						<div className="bg-white dark:bg-gray-700 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-600 max-w-[85%]">
							<p className="text-gray-700 dark:text-gray-200 leading-relaxed">
								Hi! I'm your AI interview coach. I can help you practice for any interview. What would you like to work on today?
							</p>
						</div>
					</div>

					{currentMessages.map((message) => (
						<div
							key={message.id}
							className={`flex items-start gap-3 max-w-4xl ${
								message.sender === 'user' ? 'justify-end' : ''
							}`}
						>
							{message.sender === 'ai' && (
								<div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-600 flex-shrink-0">
									<Image
										src="/assets/logo_robot.png"
										alt="Ace AI Robot"
										width={24}
										height={24}
										className="object-contain"
									/>
								</div>
							)}
							<div
								className={`rounded-2xl px-4 py-3 shadow-sm max-w-[85%] ${
									message.sender === 'user'
										? 'bg-primary text-white rounded-tr-md'
										: 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-600 rounded-tl-md'
								}`}
							>
								<p className="leading-relaxed">{message.text}</p>
							</div>
							{message.sender === 'user' && (
								<div className="w-10 h-10 bg-gray-600 dark:bg-gray-500 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
									<span className="text-white font-semibold text-sm">U</span>
								</div>
							)}
						</div>
					))}

					{isTyping && (
						<div className={`flex items-start gap-3 max-w-4xl ${
							conversations[currentConversation].messages[currentMessageIndex]?.sender === 'user' ? 'justify-end' : ''
						}`}>
							{conversations[currentConversation].messages[currentMessageIndex]?.sender === 'ai' && (
								<div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-600 flex-shrink-0">
									<Image
										src="/assets/logo_robot.png"
										alt="Ace AI Robot"
										width={24}
										height={24}
										className="object-contain"
									/>
								</div>
							)}
							<div
								className={`rounded-2xl px-4 py-3 shadow-sm max-w-[85%] ${
									conversations[currentConversation].messages[currentMessageIndex]?.sender === 'user'
										? 'bg-primary text-white rounded-tr-md'
										: 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-600 rounded-tl-md'
								}`}
							>
								<p className="leading-relaxed">
									{typingText}
									<span className="animate-pulse ml-1 text-primary">●</span>
								</p>
							</div>
							{conversations[currentConversation].messages[currentMessageIndex]?.sender === 'user' && (
								<div className="w-10 h-10 bg-gray-600 dark:bg-gray-500 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
									<span className="text-white font-semibold text-sm">U</span>
								</div>
							)}
						</div>
					)}

					<div ref={messagesEndRef} />
				</div>

				<div className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
								<span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
								Live demo - See how Ace AI coaches you through interviews
							</div>
						</div>
						<div className="flex items-center gap-2">
							{conversations.map((_, index) => (
								<div
									key={index}
									className={`w-2 h-2 rounded-full transition-colors duration-300 ${
										index === currentConversation ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
									}`}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Hero;
