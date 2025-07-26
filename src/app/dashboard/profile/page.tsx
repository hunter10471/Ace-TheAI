"use client";

import React, { useState } from "react";
import { FaUser, FaBriefcase, FaCalendarAlt, FaFlag } from "react-icons/fa";
import Button from "@/components/small/Button/Button";
import Image from "next/image";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SkillsSelector from "@/components/medium/SkillsSelector/SkillsSelector";
import { jobTitles } from "@/lib/data";
import PageHeader from "@/components/big/PageHeader/PageHeader";
// @ts-ignore
import countryList from 'react-select-country-list'

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: null as Date | null,
    phoneNumber: "",
    country: "",
    jobTitle: "",
    yearsOfExperience: "",
    keySkills: ["SQL", "Node.js", "CSS"],
    professionalGoal: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData(prev => ({
      ...prev,
      phoneNumber: value || ""
    }));
  };

  const handleSkillsChange = (skills: string[]) => {
    setFormData(prev => ({
      ...prev,
      keySkills: skills
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      dateOfBirth: date
    }));
  };

  const handleSave = () => {
    console.log("Saving profile data:", formData);
  };

  const handleDiscard = () => {
    setFormData({
      fullName: "",
      dateOfBirth: null,
      phoneNumber: "",
      country: "",
      jobTitle: "",
      yearsOfExperience: "",
      keySkills: ["SQL", "Node.js", "CSS"],
      professionalGoal: ""
    });
  };

  const countryOptions = countryList().getData();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader 
        title="Your Profile"
        subtitle="Last Edit on 12th February 2024"
        userEmail="rafay.zia@gmail.com"
      />

      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 rounded-full overflow-hidden">
          <Image
            src="/assets/avatar.jpg"
            alt="Profile Avatar"
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex gap-3">
          <Button
            text="Change Picture"
            type="primary"
            htmlButtonType="button"
            className="px-4 py-2"
          />
          <Button
            text="Delete Picture"
            type="outline"
            htmlButtonType="button"
            className="px-4 py-2"
          />
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <FaUser className="text-red-500 text-xl" />
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">Personal Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full legal name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <DatePicker
                  selected={formData.dateOfBirth}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="DD/MM/YYYY"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  maxDate={new Date()}
                />
                <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="phone-input-container">
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry="PK"
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  className="phone-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country
              </label>
              <div className="relative">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
                >
                  <option value="">Select a country</option>
                  {countryOptions.map((country: { value: string; label: string }) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
                <FaFlag className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-6">
            <FaBriefcase className="text-red-500 text-xl" />
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">Professional Summary</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Title
              </label>
              <select
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a suitable title</option>
                {jobTitles.map(title => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Years of Experience
              </label>
              <input
                type="text"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                placeholder="Enter your years of experience"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Key Skills
              </label>
              <SkillsSelector
                selectedSkills={formData.keySkills}
                onSkillsChange={handleSkillsChange}
                maxSkills={5}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Professional Goal
              </label>
              <textarea
                name="professionalGoal"
                value={formData.professionalGoal}
                onChange={handleInputChange}
                placeholder="State in minimum 50 words what your professional ambitions and goals are."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          text="Discard"
          type="black-outline"
          htmlButtonType="button"
          action={handleDiscard}
          className="px-6 py-2"
        />
        <Button
          text="Save"
          type="primary"
          htmlButtonType="button"
          action={handleSave}
          className="px-6 py-2"
        />
      </div>


    </div>
  );
};

export default ProfilePage;
