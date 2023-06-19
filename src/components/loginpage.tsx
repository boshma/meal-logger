// src/components/LoginPage.tsx
import React from 'react';
import { SignInButton } from "@clerk/nextjs";
import { Button } from './button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/accordion"
import Link from 'next/link';

const LoginPage: React.FC = () => (
  <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6">
    <Card className="container max-w-md py-8 px-6 transform transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-4xl sm:text-5xl font-extrabold text-primary">
          Welcome to Fitache
        </CardTitle>
        <CardDescription className="text-center py-6 text-lg font-light text-foreground leading-extra-loose">
          The most convenient macro-tracking app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>About Fitache</AccordionTrigger>
            <AccordionContent>
              Fitache is an application designed to help you track your macronutrients intake and meals with ease. It uses the nutritionix API to fetch data about various food items. You can find the opensource code <Link href="https://github.com/boshma/meal-logger">Here</Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Technologies Used</AccordionTrigger>
            <AccordionContent>
              This application is built using a mix of powerful technologies including Next.js for frontend, PlanetScale for database, TRPC for remote procedure calls, Vercel for deployment, Prisma as an ORM, Clerk.dev for authentication, and the Nutritionix API for nutrition data.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>How to get started?</AccordionTrigger>
            <AccordionContent>
              To start using Fitache, you simply need to sign in using the button below. The process is passwordless. After signing in, you can begin logging your meals and tracking your macros.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        </CardContent>
      <CardFooter className="justify-center pt-8">
        <SignInButton>
          <Button variant={'ghost'} className="w-full text-lg py-3 font-bold animate-pulse">
            Sign in
          </Button>
        </SignInButton>
      </CardFooter>
    </Card>
  </div>
);

export default LoginPage;
