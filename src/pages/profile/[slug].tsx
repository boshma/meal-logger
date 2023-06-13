import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Navbar from "~/components/navbar";
import Image from "next/image";
import SetTargetMacros, { TargetMacrosDialog } from "~/components/targets";

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

export default ProfilePage;
