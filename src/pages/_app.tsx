// src/pages/_app.tsx
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import {shadesOfPurple} from "@clerk/themes";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <ClerkProvider  appearance={{
    baseTheme: shadesOfPurple,  
  }} {...pageProps}>
    
    <Toaster />
    <Component {...pageProps} />
  </ClerkProvider>
};

export default api.withTRPC(MyApp);


