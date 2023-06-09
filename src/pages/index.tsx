//srs/pages/index.tsx
import { useUser } from "@clerk/nextjs";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import LoginPage from "~/components/loginpage";
import { MealsPage } from "~/components/meal-dashboard/meal-page-layout";
import Navbar from "~/components/navbar";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

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
        {!!user.isSignedIn && <Navbar />}
        <div className="mb-4 flex flex-col items-center justify-center">
          {!user.isSignedIn && <LoginPage />}
          {!!user.isSignedIn && <MealsPage />}
        </div>
      </main>
    </>
  );
};

export default Home;
