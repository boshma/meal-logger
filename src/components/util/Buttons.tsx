// src/components/util/Buttons.tsx

import React from 'react';

type AddFoodButtonProps = {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export const AddFoodButton: React.FC<AddFoodButtonProps> = ({ onClick }) => (
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

type DeleteButtonProps = {
  onClick?: () => void;
};

export const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => (
  <button onClick={onClick} className="bg-transparent">
    <svg xmlns="http://www.w3.org/2000/svg" fill="#B3404A" viewBox="0 0 512 512" className="w-6 h-6">
      <path d="M434.571,135.961c-8.435-13.251-21.524-22.423-36.856-25.828  c-7.712-1.722-15.362,3.152-17.076,10.869c-1.713,7.718,3.153,15.361,10.869,17.076c7.869,1.749,14.585,6.455,18.913,13.255   c4.328,6.8,5.75,14.879,4.002,22.748l-7.423,33.418L99.603,139.224l7.423-33.42c3.608-16.243,19.754-26.519,36.002-22.917   l145.2,32.249c7.713,1.713,15.361-3.153,17.076-10.869c1.713-7.718-3.153-15.361-10.869-17.076l-82.44-18.309l8.327-37.493   l122.96,27.308l-11.431,51.467c-1.713,7.718,3.153,15.361,10.869,17.076c1.045,0.232,2.088,0.344,3.116,0.344   c6.563,0,12.478-4.542,13.96-11.213l14.534-65.44c0.823-3.706,0.14-7.587-1.898-10.789c-2.038-3.202-5.266-5.463-8.972-6.286   L212.555,0.342c-7.713-1.709-15.362,3.152-17.076,10.869l-11.43,51.466l-34.815-7.732C117.579,47.909,86.11,67.948,79.079,99.6   l-10.526,47.391c-1.713,7.718,3.153,15.361,10.869,17.076l190.666,42.347H114.402c-7.905,0-14.313,6.409-14.313,14.313v276.96   c0,7.904,6.408,14.313,14.313,14.313h274.81c7.905,0,14.313-6.409,14.313-14.313V236.049l11.243,2.498   c1.026,0.229,2.067,0.341,3.103,0.341c2.701,0,5.37-0.764,7.686-2.239c3.202-2.038,5.463-5.266,6.288-8.972l10.526-47.391   C445.776,164.954,443.006,149.212,434.571,135.961z M374.9,483.374H128.716V235.04H374.9V483.374z" />
    </svg>
  </button>
);

type EditButtonProps = {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export const EditButton: React.FC<EditButtonProps> = ({ onClick, type = "button" }) => (
  <button onClick={onClick} type={type} className="btn btn-circle">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 30 30" stroke="currentColor">
      <path fill="#3939aa" d="M24.89 12.41A1.51 1.51 0 0 1 23.83 12L20 8.17a1.5 1.5 0 1 1 2.12-2.12L26 9.85a1.5 1.5 0 0 1-1.06 2.56zM26 29.5H4A1.5 1.5 0 0 1 2.5 28V6A1.5 1.5 0 0 1 4 4.5H15a1.5 1.5 0 0 1 0 3H5.5v19h19V17a1.5 1.5 0 0 1 3 0V28A1.5 1.5 0 0 1 26 29.5z" />
    </svg>
  </button>
);



