// src/components/LoginPage.tsx
import React from 'react';
import { SignInButton } from "@clerk/nextjs";
import { Button } from './button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';

const LoginPage: React.FC = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Card className="container max-w-md transform transition-transform duration-500 ease-in-out hover:scale-105">
      <CardHeader>
        <CardTitle className="text-center text-5xl font-bold text-primary">
          Welcome to Fitache
        </CardTitle>
        <CardDescription className="text-center py-6 text-foreground">
          The most convienent macrotracking app.
        </CardDescription>
      </CardHeader>
      <CardFooter className="justify-center">
        <SignInButton>
          <Button variant={'ghost'}>
            Sign in
          </Button>
        </SignInButton>
      </CardFooter>
    </Card>
  </div>
);

export default LoginPage;
