//src/server/api/routers/food/targetmacros.ts
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { filterUserForClient } from "../../../helpers/filterUserForClient";

export const targetMacrosRouter = createTRPCRouter({
   // Define a private route that sets or updates target macros for a user
   setTargetMacros: privateProcedure
   .input(
     z.object({
       protein: z.number(),
       carbs: z.number(),
       fat: z.number(),
     })
   )
   .mutation(async ({ ctx, input }) => {
     const userId = ctx.userId;

     const targetMacros = await ctx.prisma.targetMacros.upsert({
       where: { userId },
       create: {
         ...input,
         userId,
         isSet: true,
       },
       update: {
         ...input,
         isSet: true,
       },
     });

     return targetMacros;
   }),
 // Define a private route that retrieves the latest target macros for a user
 getTargetMacros: privateProcedure.query(async ({ ctx }) => {
   const userId = ctx.userId;
   const targetMacros = await ctx.prisma.targetMacros.findFirst({
     where: {
       userId: userId,
     },
     orderBy: {
       createdAt: 'desc',
     },
   });
   return targetMacros;
 }),
 // Define a private route that removes target macros for a user
 removeTargetMacros: privateProcedure.mutation(async ({ ctx }) => {
   const userId = ctx.userId;

   // Update the isSet flag to false for all target macros for this user
   const targetMacros = await ctx.prisma.targetMacros.updateMany({
     where: { userId },
     data: {
       isSet: false, // isSet flag is false when user removes macros
     },
   });

   return targetMacros;
 }),
 getUserByUserId: publicProcedure
 .input(z.object({ userId: z.string() }))
 .query(async ({ input }) => {
   const user = await clerkClient.users.getUser(input.userId);

   if (!user) {
     throw new TRPCError({
       code: "INTERNAL_SERVER_ERROR",
       message: "User not found",
     });
   }

   return filterUserForClient(user);
 }),
});