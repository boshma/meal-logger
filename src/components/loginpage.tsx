// src/components/LoginPage.tsx
import React, { useEffect, useState } from 'react';
import { SignInButton } from "@clerk/nextjs";
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
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

  useEffect(() => {
    const interval = setInterval(() => {
      setBackground(getCurrentBackground());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
            The most convenient macro-tracking app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-slideInFromRight">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>About Fitache</AccordionTrigger>
                <AccordionContent>
                  Fitache is an application designed to help you track your macronutrients intake and meals with ease. Users can &apos;quick add&apos;, add meals to their meal log from their collection, or add meals to the meal log via Nutritionix api. You can find the opensource code <a target="_blank" href="https://github.com/boshma/meal-logger">here (click)</a>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Technologies Used</AccordionTrigger>
                <AccordionContent>
                  This application is built using a mix of technologies including Next.js, Tailwind, TRPC, and Typescript (apart of the T3 stack). The application is hosted on Vercel and uses Clerk for authentication. Data is stored via PlanetScale.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>How to get started?</AccordionTrigger>
                <AccordionContent>
                  To start using Fitache, you simply need to sign in using the button below. The process is passwordless. After signing in, you can begin logging your meals and tracking your macros.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardContent>
        <CardFooter className="justify-center pt-8">
          <SignInButton>
            <Button variant={'ghost'} className="w-full text-lg py-3 font-bold animate-pulse font-body">
              Sign in
            </Button>
          </SignInButton>
        </CardFooter>
      </Card>
    </div>
  );
}

export default LoginPage;
