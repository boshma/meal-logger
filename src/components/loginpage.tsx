// src/components/LoginPage.tsx

import React from 'react';
import { GoogleLoginButton } from './util/Buttons';
import { SignInButton } from "@clerk/nextjs";

const LoginPage: React.FC = () => (
  <div className="hero min-h-screen bg-base-200">
    <div className="hero-content text-center">
      <div className="max-w-md">
        <h1 className="text-5xl font-bold">Welcome to Fitache </h1>
        <p className="py-6">The Ultimate tool for tracking your macros built for user ease.</p>
        <SignInButton>
          <GoogleLoginButton />
        </SignInButton>
      </div>
    </div>
  </div>
);

export default LoginPage;
