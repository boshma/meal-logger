// src/pages/index.tsx
import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import LoginPage from "~/components/loginpage";
import { MealsPage } from "~/components/meals";  // Make sure to import MealsPage
import Navbar from "~/components/navbar";

const Home: NextPage = () => {
  const user = useUser();

  return (
    <>
      <Head>
        <title>Fitache</title>
        <meta name="description" content="Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col h-screen items-center justify-start pt-14">
        {/* Show Navbar if user is signed in */}
        {!!user.isSignedIn && <Navbar />}
        <div className="mb-4 flex flex-col items-center justify-center">
          {/* If the user is not signed in, display the LoginPage component */}
          {!user.isSignedIn && <LoginPage />}
          {/* Show MealsPage component when user is signed in */}
          {!!user.isSignedIn && <MealsPage />}
        </div>
      </main>
    </>
  );
};

export default Home;
