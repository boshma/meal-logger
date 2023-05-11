// src/pages/index.tsx
import { SignInButton, useUser, useClerk } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const user = useUser();
  console.log(user);
  const { data, isLoading } = user.isSignedIn ? api.food.getAll.useQuery() : { data: null, isLoading: false };

  return (
    <>
      <Head>
        <title>Fitache</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col items-center justify-center">
        <div className="mb-4 flex items-center justify-center">
          {!user.isSignedIn && <SignInButton />}
          {!!user.isSignedIn && <SignOutButton />}
        </div>
        <div className="flex flex-col items-center">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            data?.map((food) => (
              <div key={food.id} className="mb-2">
                user: {food.userId} {food.name} fats: {food.fat} carbs: {food.carbs} protein: {food.protein}
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
};

const SignOutButton = () => {
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut().catch((error) => {
      console.error("Failed to sign out", error);
    });
  };

  return <button onClick={handleSignOut}>Sign out</button>;
};

export default Home;
