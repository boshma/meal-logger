// src/components/LoginPage.tsx
import React, { useState } from 'react';
import { SignInButton } from "@clerk/nextjs";
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { AnimatePresence, motion } from "framer-motion";

const backgroundColors = [
  'radial-gradient(circle at center, #050A30, #1F3467, #3D609B)',
  'radial-gradient(circle at center, #050A30, #2A165E, #763D8C)', 
  'radial-gradient(circle at center, #050A30, #3D609B, #C1D6F2)', 
  'radial-gradient(circle at center, #1F3467, #763D8C, #C1D6F2)', 
];
let colorIndex = 0;

function getCurrentBackground() {
  if (colorIndex >= backgroundColors.length) {
    colorIndex = 0;
  }

  return backgroundColors[colorIndex++];
}

const LoginPage: React.FC = () => {
  const [background, setBackground] = useState(getCurrentBackground());

  const handleMouseEnter = () => {
    setBackground(getCurrentBackground());
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6">
      <AnimatePresence mode='wait'>
        <motion.div
          key={background}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background,
            zIndex: -1
          }}
        />

      </AnimatePresence>
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
            <Button onMouseEnter={handleMouseEnter} variant={'ghost'} className="w-full text-lg py-3 font-bold animate-pulse font-body">
              Sign in with Github or Google
            </Button>
          </SignInButton>
      </Card>
    </div>
  );
}

export default LoginPage;
