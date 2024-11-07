import React, { HTMLInputTypeAttribute, useState } from "react";
import { useField } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputProps {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  type: HTMLInputTypeAttribute;
  name: string;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  icon,
  name,
  type,
}) => {
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-2 lg:mb-3">
      <label
        htmlFor={name}
        className="block font-medium mb-2 text-xs lg:text-sm"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute text-gray-500 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          type={type === "password" && showPassword ? "text" : type}
          id={name}
          {...field}
          placeholder={placeholder}
          className={`shadow-sm block focus:outline-text w-full pl-10 pr-12 py-2 text-sm border-gray-300 rounded-md`}
        />
        {type === "password" && (
          <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
            {showPassword ? (
              <FaEyeSlash
                size={18}
                className="text-gray-500 hover:text-gray-700"
                onClick={togglePasswordVisibility}
              />
            ) : (
              <FaEye
                size={18}
                className="text-gray-500 hover:text-gray-700"
                onClick={togglePasswordVisibility}
              />
            )}
          </div>
        )}
      </div>
      {name === "password" && (
        <span className="text-[10px] text-gray-400">
          Must contain 1 uppercase letter, 1 number, min. 8 characters
        </span>
      )}
      {meta.error && meta.touched && (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      )}
    </div>
  );
};

export default Input;
