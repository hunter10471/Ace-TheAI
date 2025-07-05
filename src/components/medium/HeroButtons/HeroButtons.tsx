"use client"
import Button from '@/components/small/Button/Button'
import { useModalStore } from '@/lib/store';
import React from 'react'


const HeroButtons = () => {
  const { openRegisterModal } = useModalStore();

  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('[data-section="features"]');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="flex gap-4 mt-5">
    <Button action={openRegisterModal} htmlButtonType="button" text="Get Started" type="primary" />
    <Button
      action={scrollToFeatures}
      htmlButtonType="button"
      text="Learn More"
      type="black-outline"
    />
  </div>
  )
}

export default HeroButtons