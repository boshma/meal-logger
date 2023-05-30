// src/components/LoginPage.tsx
import React from 'react';
import { GoogleLoginButton } from './util/Buttons';
import { SignInButton } from "@clerk/nextjs";

const LoginPage: React.FC = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="container max-w-md p-6 rounded-lg bg-card shadow-xl transform transition-transform duration-500 ease-in-out hover:scale-105">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-primary">Welcome to Fitache </h1>
        <p className="py-6 text-foreground">The most convienent macrotracking app.</p>
        <div className="animate-accordion-down">
          <SignInButton>
            <GoogleLoginButton />
          </SignInButton>
        </div>
      </div>
    </div>
  </div>
);

export default LoginPage;

