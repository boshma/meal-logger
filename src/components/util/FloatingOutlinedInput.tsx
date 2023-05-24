// src/components/util/FloatingOutlinedInput.tsx
import React from 'react';
import { ChangeEvent } from "react";

type FloatingOutlinedInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  inputRef?: React.RefObject<HTMLInputElement>; // New prop
};

const FloatingOutlinedInput: React.FC<FloatingOutlinedInputProps> = ({ id, value, onChange, label, inputRef }) => (
  <div className="relative">
    <input
      type="text"
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      ref={inputRef}  // prop to send user back to name input after submit
      className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
      placeholder=" "
    />
    <label
      htmlFor={id}
      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
    >
      {label}
    </label>
  </div>
);

export default FloatingOutlinedInput;

type FloatingOutlinedInputNumberProps = {
  id: string;
  value: number | null;
  onChange: (value: number | null) => void;
  label: string;
};

const FloatingOutlinedInputNumber: React.FC<FloatingOutlinedInputNumberProps> = ({ id, value, onChange, label }) => (
  <div className="relative">
    <input
      type="text"
      id={id}
      value={value === null ? '' : value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        // Only allow numbers or empty strings in the input field
        const isValidInput = /^$|^[0-9]*$/.test(e.target.value);
        if (isValidInput) {
          if (e.target.value === '') {
            onChange(null);
          } else {
            onChange(parseFloat(e.target.value));
          }
        }
      }}
      className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
      placeholder=" "
    />
    <label
      htmlFor={id}
      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
    >
      {label}
    </label>
  </div>
);

export { FloatingOutlinedInputNumber };


