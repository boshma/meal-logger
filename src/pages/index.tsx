//srs/pages/index.tsx
import { useUser } from "@clerk/nextjs";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import LoginPage from "~/components/loginpage";
import { MealsPage } from "~/components/meal-dashboard/meal-page-layout";
import Navbar from "~/components/navbar";
import { withServerSideAuth } from "@clerk/nextjs/ssr";
import { useState } from "react";

const Home: NextPage = () => {
  const user = useUser();
  const [background, setBackground] = useState('bg-gradient-1');

  return (
    <>
      <Head>
        <title>Fitache</title>
        <meta name="description" content="Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`flex flex-col h-screen items-center justify-start pt-14 ${background || ''} bg-transition`}>
        {!!user.isSignedIn && <Navbar />}
        <div className="mb-4 flex flex-col items-center justify-center">
          {!user.isSignedIn && <LoginPage setBackground={setBackground} />}
          {!!user.isSignedIn && <MealsPage />}
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withServerSideAuth( () => {
  return { props: {} };
});

export default Home;

