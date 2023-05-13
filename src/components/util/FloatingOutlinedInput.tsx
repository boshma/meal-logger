// src/components/util/FloatingOutlinedInput.tsx
import React from 'react';

type FloatingOutlinedInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
};

const FloatingOutlinedInput: React.FC<FloatingOutlinedInputProps> = ({ id, value, onChange, label }) => (
  <div className="relative mb-4">
    <input
      type="text"
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block rounded-lg px-4 py-3 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-lime-600 focus:outline-none focus:ring-0 focus:border-lime-600 peer"
      placeholder=" "
    />
    <label
      htmlFor={id}
      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-0 left-4 z-10 origin-[0] font-normal peer-focus:font-bold peer-focus:text-lime-600 peer-focus:dark:text-lime-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5 peer-empty:text-gray-500 peer-empty:font-normal peer:not-empty:text-lime-600 peer:not-empty:font-bold peer:not-empty:dark:text-lime-500"
    >
      {label}
    </label>
  </div>
);

export default FloatingOutlinedInput;
