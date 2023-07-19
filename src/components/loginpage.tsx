// src/components/LoginPage.tsx
import React from 'react';
import { SignInButton } from "@clerk/nextjs";
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';

const LoginPage: React.FC = () => {
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
        <SignInButton>
          <Button variant={'ghost'} className="w-full text-lg py-3 font-bold animate-pulse font-body">
            Sign in with Github or Google
          </Button>
        </SignInButton>
      </Card>
    </div>
  );
}

export default LoginPage;

