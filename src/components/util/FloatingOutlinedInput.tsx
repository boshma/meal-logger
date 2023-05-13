// src/components/util/FloatingOutlinedInput.tsx
import React from 'react';

type FloatingOutlinedInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
};

const FloatingOutlinedInput: React.FC<FloatingOutlinedInputProps> = ({ id, value, onChange, label }) => (
  <div className="relative bg-white dark:bg-gray-900 rounded-lg">
    <input
      type="text"
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block px-2.5 pb-2.5 pt-7 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-yellow-500 focus:outline-none focus:ring-0 focus:border-yellow-600 peer"
      placeholder=" "
    />
    <label
      htmlFor={id}
      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-2 left-2.5 z-10 origin-[0] peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-2.5"
    >
      {label}
    </label>
  </div>
);

export default FloatingOutlinedInput;
