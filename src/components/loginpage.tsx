// src/components/LoginPage.tsx
import React, { useState } from 'react';
import { SignInButton } from "@clerk/nextjs";
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';

const backgroundColors = [
  'bg-gradient-1',
  'bg-gradient-2',
  'bg-gradient-3',
  'bg-gradient-4',
];
let colorIndex = 0;

function getCurrentBackground() {
  const color = backgroundColors[colorIndex % backgroundColors.length];
  colorIndex = (colorIndex + 1) % backgroundColors.length;
  return color || 'bg-gradient-1';  
}

type LoginPageProps = {
  setBackground: React.Dispatch<React.SetStateAction<string>>;
}

const LoginPage: React.FC<LoginPageProps> = ({ setBackground }) => {
  const handleMouseEnter = () => {
    setBackground(getCurrentBackground());
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 bg-transition">
      <Card className="container max-w-md py-8 px-6 transform transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-4xl sm:text-5xl font-extrabold text-primary tracking-tighter font-heading animate-slideInFromTop">
            Welcome to Fitache
          </CardTitle>
          <CardDescription className="text-center py-6 text-lg font-light text-foreground leading-extra-loose font-body max-w-prose mx-auto animate-slideInFromBottom">
            The most convenient meal-logger app
          </CardDescription>
        </CardHeader>
        <div onMouseEnter={handleMouseEnter}>
          <SignInButton>
            <Button variant={'ghost'} className="w-full text-lg py-3 font-bold animate-pulse font-body">
              Sign in with Github or Google
            </Button>
          </SignInButton>
        </div>
      </Card>
    </div>
  );
}


export default LoginPage;
