// src/components/util/SvgButton.tsx

import React from 'react';

type SvgButtonProps = {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export const AddFoodButton: React.FC<SvgButtonProps> = ({ onClick }) => (
  <button onClick={onClick} className="btn btn-circle">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12M6 12h12" />
    </svg>
  </button>
);

type GoogleLoginButtonProps = {
  onClick?: () => void;
};

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onClick }) => (
  <div className="flex items-center justify-center px-6 sm:px-0 max-w-sm">
    <button type="button" onClick={onClick} className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center space-x-2 justify-center dark:focus:ring-[#4285F4]/55">
      <svg className="w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
      </svg>
      <span>Sign in with Google</span>
    </button>
  </div>
);


type CalendarButtonProps = {
  onClick?: () => void;
};

export const CalendarButton: React.FC<CalendarButtonProps> = ({ onClick }) => (
  <button onClick={onClick} className="btn btn-circle">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="calendar" className="h-6 w-6">
      <path d="M12,14a1,1,0,1,0-1-1A1,1,0,0,0,12,14Zm5,0a1,1,0,1,0-1-1A1,1,0,0,0,17,14Zm-5,4a1,1,0,1,0-1-1A1,1,0,0,0,12,18Zm5,0a1,1,0,1,0-1-1A1,1,0,0,0,17,18ZM7,14a1,1,0,1,0-1-1A1,1,0,0,0,7,14ZM19,4H18V3a1,1,0,0,0-2,0V4H8V3A1,1,0,0,0,6,3V4H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm1,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V10H20ZM20,8H4V7A1,1,0,0,1,5,6H19a1,1,0,0,1,1,1ZM7,18a1,1,0,1,0-1-1A1,1,0,0,0,7,18Z"></path>
    </svg>
  </button>
);

