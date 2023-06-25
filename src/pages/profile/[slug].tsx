import { useUser } from "@clerk/nextjs";
import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Navbar from "~/components/navbar";
import Image from "next/image";
import SetTargetMacros, { TargetMacrosDialog } from "~/components/targets";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { MealLog } from "~/components/meals";

const ProfilePage: NextPage = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Head>
        <title>Fitache</title>
        <meta name="description" content="Profile Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col h-screen items-center justify-start">
        {!!user && <Navbar />}
        <SetTargetMacros onOpen={handleOpen} />
        <TargetMacrosDialog open={open} handleClose={handleClose} />
      </main>
    </>
  );
};

// export const getStaticProps: GetStaticProps = async (context) => {
//   const ssg = generateSSGHelper();

//   const slug = context.params?.slug;

//   if (typeof slug !== "string") throw new Error("no slug");

//   const username = slug.replace("@", "");

//   await ssg.food.getUserByUsername.prefetch({ username });

//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       username,
//     },
//   };
// };

// export const getStaticPaths = () => {
//   return { paths: [], fallback: "blocking" };
// };

export default ProfilePage;
