//src/server/api/routers/nutritionix.ts
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import axios from 'axios';
import { clerkClient } from "@clerk/nextjs/server";
import { filterUserForClient } from "../../../helpers/filterUserForClient";
import { searchFoodInDatabase } from "~/server/helpers/searchFoodInDatabase";


// Create a new ratelimiter, that allows 2 requests per 5 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "7 s"),
  analytics: true,
});




export const mealLogRouter = createTRPCRouter({
   // Update the getByDate method to take userId in its input
   getByDate: privateProcedure
   .input(z.object({ date: z.string(), userId: z.string() }))
   .query(async ({ ctx, input }) => {
     const date = new Date(input.date);
     const nextDate = new Date(date);
     nextDate.setDate(nextDate.getDate() + 1);
     nextDate.setHours(0, 0, 0, 0);  // Set the time to the start of the day

     // Use input.userId instead of ctx.userId
     return ctx.prisma.foodEntry.findMany({
       where: {
         userId: input.userId,
         date: {
           gte: date,
           lt: nextDate,
         },
       },
     });
   }),


 // Define a private route that creates a new food entry for a user
 create: privateProcedure
   .input(
     z.object({
       name: z.string(),
       protein: z.number(),
       carbs: z.number(),
       fat: z.number(),
       servingSize: z.number().default(1),
       date: z.string(),
     })
   )
   .mutation(async ({ ctx, input }) => {
     const userId = ctx.userId;

     const { success } = await ratelimit.limit(userId);

     if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

     // Check if the user ID exists. If not, throw an error.
     if (!userId) {
       throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "User ID not found" });
     }

     // Create a new food entry and return it
     const food = await ctx.prisma.foodEntry.create({
       data: {
         ...input,
         date: new Date(input.date),
         userId,
       },
     });

     return food;
   }),
 // Define a private route that deletes a food entry for a user   
 delete: privateProcedure
   .input(z.object({ id: z.string() }))
   .mutation(async ({ ctx, input }) => {
     const { id } = input;
     const userId = ctx.userId;

     const foodEntry = await ctx.prisma.foodEntry.findFirst({
       where: {
         id,
         userId,
       },
     });

     if (!foodEntry) {
       throw new TRPCError({
         code: 'NOT_FOUND',
         message: 'No food entry found for the given ID and user',
       });
     }

     await ctx.prisma.foodEntry.delete({
       where: { id },
     });

     return { id };
   }),
 update: privateProcedure
   .input(
     z.object({
       id: z.string(),
       name: z.string(),
       protein: z.number(),
       carbs: z.number(),
       fat: z.number(),
       servingSize: z.number().optional(),
       date: z.string(),
     })
   )
   .mutation(async ({ ctx, input }) => {
     const { id, ...rest } = input;

     // Verify that the food entry exists and belongs to the user
     const foodEntry = await ctx.prisma.foodEntry.findFirst({
       where: {
         id,
         userId: ctx.userId,
       },
     });

     if (!foodEntry) {
       throw new TRPCError({
         code: "NOT_FOUND",
         message: "No food entry found for the given ID and user",
       });
     }

     // Update the food entry
     const updatedFood = await ctx.prisma.foodEntry.update({
       where: { id },
       data: {
         ...rest,
         date: new Date(input.date),
       },
     });

     return updatedFood;
   }),
});